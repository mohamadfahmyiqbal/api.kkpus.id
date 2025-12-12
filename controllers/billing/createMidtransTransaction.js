// 📁 controllers/billing/createMidtransTransaction.js

import db from "../../models/index.js";
import { createSnapTransaction } from "../../controllers/utility/midtransApi.js";

const { Bill, BillItem, Member, Transaction } = db;

/**
 * Kontroler untuk membuat transaksi Midtrans Snap.
 * Endpoint: POST /midtrans/create-transaction
 * Body: { bill_id: string }
 */
export const createMidtransTransaction = async (req, res) => {
 const { bill_id } = req.body;
 // req.userId diasumsikan disuntikkan oleh middleware otentikasi
 const memberId = req.userId;

 if (!bill_id) {
  return res.status(400).json({ status: false, message: "Bill ID diperlukan." });
 }

 let transactionDb;
 try {
  transactionDb = await db.sequelize.transaction();

  // 1. Ambil data Bill, Item, dan Member
  const bill = await Bill.findOne({
   where: { id: bill_id, member_id: memberId, status: ['UNPAID', 'PENDING'] }, // Hanya yang belum lunas
   include: [
    { model: BillItem, as: 'items' },
    { model: Member, as: 'member' }
   ],
   transaction: transactionDb
  });

  if (!bill) {
   return res.status(404).json({ status: false, message: "Tagihan tidak valid, sudah dibayar, atau tidak ditemukan." });
  }

  // Cek kembali jika ada transaksi Midtrans yang masih PENDING untuk bill ini (opsional)

  // 2. Buat Snap Transaction di Midtrans API
  const snapToken = await createSnapTransaction(bill, bill.member);

  // 3. Catat transaksi di database lokal (Opsional tapi disarankan)
  const localTransaction = await Transaction.create({
   member_id: memberId,
   bill_id: bill_id,
   amount: bill.total_amount,
   tx_type: 'MIDTRANS_SNAP',
   status: 'PENDING', // Status awal di backend lokal
   midtrans_token: snapToken, // Simpan token untuk referensi
   // ... field lain yang relevan
  }, { transaction: transactionDb });

  // 4. Update status Bill menjadi PENDING
  await bill.update({ status: 'PENDING' }, { transaction: transactionDb });

  await transactionDb.commit();

  // 5. Kirim Snap Token ke frontend
  return res.status(200).json({
   status: true,
   message: "Snap Token berhasil dibuat.",
   snapToken: snapToken
  });

 } catch (error) {
  if (transactionDb) await transactionDb.rollback();
  console.error("[createMidtransTransaction] Error:", error);
  return res.status(500).json({ status: false, message: error.message || "Gagal membuat transaksi Midtrans internal." });
 }
};