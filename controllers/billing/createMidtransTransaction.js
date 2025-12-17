import db from "../../models/index.js";
import { createSnapTransaction } from "../../controllers/utility/midtransApi.js";

const { Bill, BillItem, Member, Transaction, BillType } = db;

/**
 * Controller untuk membuat transaksi Midtrans secara dinamis
 * Berdasarkan data Bill dan BillType di database.
 */
export const createMidtransTransaction = async (req, res) => {
  const { bill_id } = req.body;
  const memberId = req.userId; // Diambil dari middleware autentikasi

  if (!bill_id) {
    return res.status(400).json({
      status: false,
      message: "Bill ID (ID Tagihan) wajib disertakan.",
    });
  }

  let transactionDb;
  try {
    // Memulai database transaction untuk menjaga integritas data
    transactionDb = await db.sequelize.transaction();

    // 1. Ambil data Bill beserta relasi BillType untuk mendapatkan tx_type secara dinamis
    const bill = await Bill.findOne({
      where: {
        bill_id: bill_id,
        member_id: memberId,
        status: ["UNPAID", "PENDING"],
      },
      include: [
        { model: BillItem, as: "items" },
        { model: Member, as: "member" },
        {
          model: BillType,
          as: "billType", // 🛠️ UBAH DARI 'bill_type' MENJADI 'billType'
          attributes: ["type_code", "tx_type", "category_map"],
        },
      ],
      transaction: transactionDb,
    });

    // Validasi keberadaan tagihan
    if (!bill) {
      await transactionDb.rollback();
      return res.status(404).json({
        status: false,
        message: "Tagihan tidak ditemukan, tidak valid, atau sudah lunas.",
      });
    }

    // 2. Buat Snap Transaction melalui Utility Midtrans API
    const { snapToken, midtransOrderId } = await createSnapTransaction(
      bill,
      bill.member
    );

    // 3. Catat transaksi di tabel 'transactions' secara dinamis
    // tx_type dan tx_category diambil langsung dari konfigurasi di BillType
    const localTransaction = await Transaction.create(
      {
        member_id: memberId,
        bill_id: bill.bill_id,
        midtrans_order_id: midtransOrderId,
        amount: bill.amount,
        // 🛠️ PASTIKAN JUGA PEMANGGILAN PROPERTINYA MENGGUNAKAN billType
        tx_type: bill.billType.tx_type || "SETORAN",
        tx_category: bill.billType.category_map || "OTHER",
        status: "PENDING",
        is_ledger_recorded: false,
        midtrans_token: snapToken,
      },
      { transaction: transactionDb }
    );

    // 4. Update status Bill menjadi PENDING agar tidak dibayar ganda
    await bill.update({ status: "PENDING" }, { transaction: transactionDb });

    // Commit semua perubahan jika berhasil
    await transactionDb.commit();

    return res.status(200).json({
      status: true,
      message: "Transaksi berhasil diinisialisasi.",
      data: {
        snapToken: snapToken,
        orderId: midtransOrderId,
        amount: bill.amount,
        description: bill.description,
      },
    });
  } catch (error) {
    // Rollback jika terjadi kesalahan di tengah proses
    if (transactionDb) await transactionDb.rollback();

    console.error("[createMidtransTransaction] Error:", error);

    return res.status(500).json({
      status: false,
      message: "Gagal memproses transaksi pembayaran.",
      error: error.message,
    });
  }
};
