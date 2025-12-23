// 📁 controllers/savings/processSavingsPayment.js
import db from "../../models/index.js";
import { createInitialBills } from "../billing/createInitialBills.js";
import { createSnapTransaction } from "../utility/midtransApi.js";

const { Bill, BillItem, Member, BillType, Transaction } = db;

export const processSavingsPayment = async (req, res) => {
  const { amount, category } = req.body;
  const memberId = req.userId;
  let t;

  try {
    t = await db.sequelize.transaction();

    // Penentuan typeCode berdasarkan kategori dari frontend
    let typeCode = "SS_SUKARELA"; 
    if (category.toLowerCase().includes("wajib")) typeCode = "SW_BULANAN";

    // 1. Buat Tagihan (Bill)
    const billId = await createInitialBills(memberId, [typeCode], amount, t);

    // 2. Ambil data lengkap untuk Midtrans (Sesuai as alias di index.js)
    const billFull = await Bill.findOne({
      where: { bill_id: billId },
      include: [
        { model: BillItem, as: "items" },
        { model: Member, as: "member" },
        { model: BillType, as: "billType" },
      ],
      transaction: t,
    });

    // 3. Inisialisasi Midtrans Snap
    const { snapToken, midtransOrderId } = await createSnapTransaction(
      billFull,
      billFull.member
    );

    // 4. Simpan ke tabel Transaction lokal
    await Transaction.create(
      {
        member_id: memberId,
        bill_id: billId,
        midtrans_order_id: midtransOrderId,
        amount: amount,
        tx_type: billFull.billType?.tx_type || "SETORAN",
        tx_category: category,
        status: "PENDING",
        midtrans_token: snapToken,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      status: true,
      billId: billId,
      snapToken: snapToken,
    });
  } catch (error) {
    if (t) await t.rollback();
    console.error("[processSavingsPayment] Error:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal memproses pembayaran simpanan.",
      error: error.message,
    });
  }
};