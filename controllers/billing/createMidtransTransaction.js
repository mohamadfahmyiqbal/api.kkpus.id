// 📁 controllers/billing/createMidtransTransaction.js
import db from "../../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { jwtEncode } from "../../utils/jwtHelpers.js";
import { prepareBillItems } from "../../services/billingHelper.js";
import { requestMidtransCharge } from "../../services/midtransPaymentHandler.js";

const { Bill, BillItem, Transaction, Member } = db;

export const createMidtransTransaction = async (req, res) => {
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
    const { total_gross, item_details, final_bill_item_ids, bill_type_id } =
      await prepareBillItems({
        tx_category,
        bill_item_ids,
        amount,
        financing_id,
        member,
        dbTransaction,
      });

    // 3. Buat Header Tagihan (Bill)
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

    // 4. Request ke Midtrans Core API
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    const pageName = "invoicePage";
    const returnPage = tx_category === "MEMBER_REGISTRATION" ? "registrationPage" : "billingPage";
    const successToken = jwtEncode({
      page: pageName,
      billId: generatedBillId,
      return: returnPage,
      status: "success",
    });

    const order_id = `BILL-${generatedBillId}-${uuidv4().split("-")[0].toUpperCase()}`;

    const { midtransTx, final_gross } = await requestMidtransCharge({
      order_id,
      total_gross,
      item_details,
      member,
      payment_type,
      FRONTEND_URL,
      successToken,
    });

    // Perbarui amount di header bill jika ada tambahan fee
    if (final_gross !== total_gross) {
      await newBillHeader.update({ amount: final_gross }, { transaction: dbTransaction });
    }

    // 5. Simpan Log Transaksi Lokal
    await Transaction.create(
      {
        member_id: member.member_id,
        bill_id: generatedBillId,
        midtrans_order_id: order_id,
        amount: final_gross,
        status: "PENDING",
        tx_type: "SETORAN",
        tx_category: tx_category,
        payment_type: "midtrans",
        is_ledger_recorded: false,
      },
      { transaction: dbTransaction }
    );

    // 6. Commit Semua Perubahan DB
    await dbTransaction.commit();

    return res.status(200).json({
      status: true,
      data: {
        midtransResponse: midtransTx,
        billId: generatedBillId,
        orderId: order_id,
      },
    });
  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("CREATE_MIDTRANS_ERROR:", error);
    return res.status(400).json({
      status: false,
      message: error.message || "Gagal membuat transaksi.",
    });
  }
};