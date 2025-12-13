// 📁 controllers/billing/createMidtransTransaction.js

import db from "../../models/index.js";
import { createSnapTransaction } from "../../controllers/utility/midtransApi.js";

// ✅ Model Transaction sekarang sudah bisa diakses
const { Bill, BillItem, Member, Transaction } = db;

export const createMidtransTransaction = async (req, res) => {
  // Variabel bill_id dari req.body, digunakan untuk mencari di DB.
  const { bill_id, tx_category } = req.body;

  const memberId = req.userId;
  if (!bill_id) {
    return res
      .status(400)
      .json({ status: false, message: "Bill ID diperlukan." });
  }

  let transactionDb;
  try {
    transactionDb = await db.sequelize.transaction();

    // 1. Ambil data Bill, Item, dan Member (mendapatkan objek 'bill')
    const bill = await Bill.findOne({
      where: {
        bill_id: bill_id, // Menggunakan bill_id dari req.body untuk mencari
        member_id: memberId,
        // 🛑 KOREKSI: Menggunakan nama kolom yang benar di DB: 'status'
        status: ["UNPAID", "PENDING"],
      },
      include: [
        { model: BillItem, as: "items" },
        { model: Member, as: "member" },
      ],
      transaction: transactionDb,
    });

    if (!bill) {
      await transactionDb.rollback();
      return res.status(404).json({
        status: false,
        message: "Tagihan tidak valid, sudah dibayar, atau tidak ditemukan.",
      });
    }

    // 2. Buat Snap Transaction di Midtrans API
    const { snapToken, midtransOrderId } = await createSnapTransaction(
      bill,
      bill.member
    );

    // 3. Catat transaksi di database lokal
    const localTransaction = await Transaction.create(
      {
        member_id: memberId,
        // 🛑 FIX KRITIS: Secara eksplisit menggunakan nilai BIGINT dari objek bill
        bill_id: bill.bill_id,
        midtrans_order_id: midtransOrderId,
        amount: bill.amount,
        tx_type: "MIDTRANS_SNAP",
        tx_category: tx_category,
        status: "PENDING",
        midtrans_token: snapToken,
      },
      { transaction: transactionDb }
    );

    // 4. Update status Bill menjadi PENDING
    // 🛑 KOREKSI: Menggunakan nama kolom yang benar di DB: 'status'
    await bill.update({ status: "PENDING" }, { transaction: transactionDb });

    await transactionDb.commit();

    // 5. Kirim Snap Token ke frontend
    return res.status(200).json({
      status: true,
      message: "Snap Token berhasil dibuat.",
      snapToken: snapToken,
    });
  } catch (error) {
    if (transactionDb) await transactionDb.rollback();
    console.error("[createMidtransTransaction] Error:", error);

    // Memberikan pesan error yang lebih informatif
    const errorMessage = error.message.includes("Midtrans")
      ? error.message.replace("Gagal memproses Midtrans: ", "")
      : "Terjadi kesalahan internal saat memproses pembayaran.";

    return res.status(500).json({
      status: false,
      message: errorMessage,
    });
  }
};
