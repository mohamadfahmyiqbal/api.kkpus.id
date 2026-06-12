// 📁 controllers/billing/createMidtransTransaction.js
import db from "../../models/index.js";
import midtransClient from "midtrans-client";
import { v4 as uuidv4 } from "uuid";
import { jwtEncode } from "../../utils/jwtHelpers.js";

const { Bill, BillItem, BillType, Transaction, Member } = db;

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const createMidtransTransaction = async (req, res) => {
  let dbTransaction;
  try {
    if (!req.userId) {
      return res.status(401).json({ status: false, message: "Autentikasi gagal." });
    }

    const { bill_item_ids, tx_category, amount } = req.body;
    dbTransaction = await db.sequelize.transaction();

    // 1. Validasi Profil Anggota (Gunakan lock untuk konsistensi saldo nantinya)
    const member = await Member.findByPk(req.userId, { 
      transaction: dbTransaction,
    });
    if (!member) throw new Error("Data profil anggota tidak ditemukan.");

    let total_gross = 0;
    let item_details = [];
    let final_bill_item_ids = [];
    let bill_type_id = null;

    // --- LOGIKA A: MEMBER_REGISTRATION (Update item yang sudah ada) ---
    if (tx_category === "MEMBER_REGISTRATION") {
      const sanitizedIds = (Array.isArray(bill_item_ids) ? bill_item_ids : [bill_item_ids])
        .filter(id => id && String(id).trim() !== '');

      if (sanitizedIds.length === 0) throw new Error("Item tagihan tidak dipilih.");

      // Cari item yang valid, milik user tersebut, dan belum dibayar
      const existingItems = await BillItem.findAll({
        where: { 
          bill_item_id: sanitizedIds,
          member_id: member.member_id,
          status: 'UNPAID'
        },
        transaction: dbTransaction,
      });

      if (existingItems.length !== sanitizedIds.length) {
        throw new Error("Sebagian tagihan sudah dibayar atau tidak ditemukan.");
      }

      bill_type_id = existingItems[0].bill_type_id;
      item_details = existingItems.map(item => {
        const amt = parseFloat(item.amount);
        total_gross += amt;
        return {
          id: `ITEM-${item.bill_item_id}`,
          price: amt,
          quantity: 1,
          name: item.description.substring(0, 50)
        };
      });
      final_bill_item_ids = sanitizedIds;
    }

    // --- LOGIKA B: DEPOSIT_SUKARELA (Buat item baru) ---
    else if (tx_category === "DEPOSIT_SUKARELA") {
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount < 10000) {
        throw new Error("Nominal deposit minimal Rp 10.000.");
      }
      
      total_gross = parsedAmount;
      const typeSukarela = await BillType.findOne({ where: { type_code: "SUKARELA" }, transaction: dbTransaction });
      bill_type_id = typeSukarela?.bill_type_id || 99;

      // Buat BillItem pendahulu (bill_id akan diupdate nanti setelah header terbuat)
      const newItem = await BillItem.create({
        member_id: member.member_id,
        bill_type_id: bill_type_id,
        amount: total_gross,
        status: "UNPAID",
        description: "Simpanan Sukarela",
        category_code: "SUKARELA", // Added category_code which is required
        due_date: new Date() // Added due_date which is required
      }, { transaction: dbTransaction });

      final_bill_item_ids = [newItem.bill_item_id];
      item_details = [{ 
        id: `ITEM-${newItem.bill_item_id}`, 
        price: total_gross, 
        quantity: 1, 
        name: "Deposit Sukarela" 
      }];
    }
    

    // --- LOGIKA D: DEFAULT TRANSAKSI LAINNYA ---
    else {
      const sanitizedIds = (Array.isArray(bill_item_ids) ? bill_item_ids : [bill_item_ids])
        .filter(id => id && String(id).trim() !== '');

      if (sanitizedIds.length === 0) throw new Error("Item tagihan tidak dipilih.");

      const existingItems = await BillItem.findAll({
        where: { 
          bill_item_id: sanitizedIds,
          member_id: member.member_id,
          status: 'UNPAID'
        },
        transaction: dbTransaction,
      });

      if (existingItems.length !== sanitizedIds.length) {
        throw new Error("Sebagian tagihan sudah dibayar atau tidak ditemukan.");
      }

      bill_type_id = existingItems[0].bill_type_id;
      item_details = existingItems.map(item => {
        const amt = parseFloat(item.amount);
        total_gross += amt;
        return {
          id: `ITEM-${item.bill_item_id}`,
          price: amt,
          quantity: 1,
          name: item.description.substring(0, 50)
        };
      });
      final_bill_item_ids = sanitizedIds;
    }

    // 2. BUAT HEADER TAGIHAN (BILLS)
    // Generate UUID untuk bill_id
    const newBillHeader = await Bill.create({
      bill_id: uuidv4(), // Generate UUID untuk bill_id
      member_id: member.member_id,
      member_no: member.member_no,
      bill_type_id: bill_type_id,
      amount: total_gross,
      status: "pending",
      description: `${tx_category} #${member.member_no}`,
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }, { transaction: dbTransaction });

    // Ambil ID yang digenerate otomatis oleh MySQL
    const generatedBillId = newBillHeader.bill_id;

    // 3. IKAT BILL_ITEM KE HEADER YANG BARU DIBUAT
    await BillItem.update(
      { bill_id: generatedBillId },
      { where: { bill_item_id: final_bill_item_ids }, transaction: dbTransaction }
    );

    // 4. SIMPAN LOG TRANSAKSI MIDTRANS
    const order_id = `BILL-${generatedBillId}-${uuidv4().split("-")[0].toUpperCase()}`;
    await Transaction.create({
      member_id: member.member_id,
      bill_id: generatedBillId,
      midtrans_order_id: order_id,
      amount: total_gross,
      status: "PENDING",
      tx_type: "SETORAN",
      tx_category: tx_category,
      payment_type: "midtrans",
      is_ledger_recorded: false
    }, { transaction: dbTransaction });

    // 5. REQUEST KE MIDTRANS SNAP
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    const pageName = "invoicePage";
    const returnPage = tx_category === "MEMBER_REGISTRATION" ? "registrationPage" : "billingPage";

    const basePayload = {
      page: pageName,
      billId: generatedBillId,
      return: returnPage,
    };

    const successToken = jwtEncode({ ...basePayload, status: "success" });
    const errorToken = jwtEncode({ ...basePayload, status: "error" });

    const midtransTx = await snap.createTransaction({
      transaction_details: { order_id, gross_amount: total_gross },
      item_details: item_details,
      customer_details: { 
        first_name: member.full_name, 
        email: member.email || "" 
      },
      gopay: {
        enable_callback: true,
        callback_url: `${FRONTEND_URL}/${successToken}`
      },
      shopeepay: {
        callback_url: `${FRONTEND_URL}/${successToken}`
      },
      callbacks: {
        finish: `${FRONTEND_URL}/${successToken}`,
        error: `${FRONTEND_URL}/${errorToken}`,
      },
      expiry: { unit: "hours", duration: 24 }
    });

    // 6. COMMIT SEMUA PERUBAHAN
    await dbTransaction.commit();

    return res.status(200).json({
      status: true,
      data: {
        snapToken: midtransTx.token,
        billId: generatedBillId,
        orderId: order_id
      }
    });

  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("CREATE_MIDTRANS_ERROR:", error);
    return res.status(400).json({ 
      status: false, 
      message: error.message || "Gagal membuat transaksi." 
    });
  }
};