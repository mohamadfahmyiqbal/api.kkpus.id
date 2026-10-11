// 📁 controllers/billing/createDokuTransaction.js
import db from "../../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { jwtEncode } from "../../utils/jwtHelpers.js";
import { prepareBillItems, calculatePaymentFee } from "../../services/billingHelper.js";
import { requestDokuPayment } from "../../services/dokuPaymentHandler.js";

const { Bill, BillItem, Transaction, Member } = db;

export const createDokuTransaction = async (req, res) => {
  let dbTransaction;
  try {
    if (!req.userId) {
      return res.status(401).json({ status: false, message: "Autentikasi gagal." });
    }

    const { bill_item_ids, tx_category, amount, payment_type, financing_id } = req.body;

    if (!payment_type) {
      return res.status(400).json({ status: false, message: "Metode pembayaran harus dipilih." });
    }
    dbTransaction = await db.sequelize.transaction();

    // 1. Validasi Profil Anggota
    const member = await Member.findByPk(req.userId, {
      transaction: dbTransaction,
    });
    if (!member) throw new Error("Data profil anggota tidak ditemukan.");

    // 2. Siapkan data item tagihan & total gross dasar
    let { total_gross, final_bill_item_ids, bill_type_id } = await prepareBillItems({
      tx_category,
      bill_item_ids,
      amount,
      financing_id,
      member,
      dbTransaction,
    });

    // 3. Hitung biaya admin berdasarkan metode pembayaran
    const pType = payment_type.toLowerCase();
    const fee = await calculatePaymentFee(pType, total_gross, dbTransaction);
    total_gross += fee;

    // 4. Buat Header Tagihan (Bill)
    const newBillHeader = await Bill.create(
      {
        bill_id: uuidv4(),
        member_id: member.member_id,
        member_no: member.member_no,
        bill_type_id: bill_type_id,
        amount: total_gross,
        status: "pending",
        description: `${tx_category} #${member.member_no}`,
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      { transaction: dbTransaction }
    );

    const generatedBillId = newBillHeader.bill_id;

    // Ikat BillItem ke header
    await BillItem.update(
      { bill_id: generatedBillId },
      { where: { bill_item_id: final_bill_item_ids }, transaction: dbTransaction }
    );

    // 5. Simpan Transaksi ke Database Lokal
    const order_id = `BILL-${generatedBillId.substring(0, 8)}-${Date.now()}`;
    const localTx = await Transaction.create(
      {
        member_id: member.member_id,
        bill_id: generatedBillId,
        midtrans_order_id: order_id,
        amount: total_gross,
        status: "PENDING",
        tx_type: "SETORAN",
        tx_category: tx_category,
        payment_type: "doku",
        payment_method: pType,
        is_ledger_recorded: false,
      },
      { transaction: dbTransaction }
    );

    // 6. Request ke DOKU API
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    const pageName = "invoicePage";
    const returnPage = tx_category === "MEMBER_REGISTRATION" ? "registrationPage" : "billingPage";
    const successToken = jwtEncode({
      page: pageName,
      billId: generatedBillId,
      return: returnPage,
      status: "success",
    });

    const paymentInstruction = await requestDokuPayment({
      pType,
      order_id,
      total_gross,
      member,
      successToken,
      FRONTEND_URL,
      localTx,
      dbTransaction,
    });

    // 7. Commit DB Transaksi
    await dbTransaction.commit();

    return res.status(200).json({
      status: true,
      data: {
        midtransResponse: paymentInstruction, // Tetap gunakan key ini agar kompatibel dengan frontend
        billId: generatedBillId,
        orderId: order_id,
        dokuData: paymentInstruction,
      },
    });
  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("CREATE_DOKU_ERROR:", error);
    return res.status(400).json({
      status: false,
      message: error.message || "Gagal membuat transaksi DOKU.",
    });
  }
};
