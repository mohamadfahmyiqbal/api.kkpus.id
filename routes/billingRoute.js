// src/routes/billingRoute.js

import express from "express";
import { MidAnggota } from "../midlleware/MidAnggota.js"; 
import getPendingBills from "../controllers/content/billing/getPendingBills.js";
// 🚨 NEW: Import controller untuk detail tagihan
import { getInvoiceDetail } from '../controllers/billing/getInvoiceDetail.js';
// 🚨 NEW: Import controller untuk Midtrans
import { createMidtransTransaction } from '../controllers/billing/createMidtransTransaction.js';

const router = express.Router();

// Middleware: Terapkan MidAnggota ke SEMUA rute di router ini.
// Asumsi: router ini dipasang di file utama Anda dengan prefix /api/tagihan.
// Contoh: app.use('/api/tagihan', router);
router.use(MidAnggota); 

/**
 * Endpoint: GET /list/pending (Jalur lengkap: /api/tagihan/list/pending)
 * Digunakan oleh: UBilling.getPendingBills()
 * Fungsi: Mengambil daftar tagihan anggota yang belum dibayar.
 */
router.get("/list/pending", getPendingBills);

/**
 * 🚨 NEW Endpoint: GET /:billId (Jalur lengkap: /api/tagihan/:billId)
 * Digunakan oleh: UBilling.getInvoiceDetail(billId)
 * Fungsi: Mengambil detail satu tagihan berdasarkan ID.
 */
router.get("/:billId", getInvoiceDetail);

/**
 * 🚨 NEW Endpoint: POST /midtrans/create-transaction 
 * (Jalur lengkap: /api/tagihan/midtrans/create-transaction)
 * Digunakan oleh: UBilling.createMidtransTransaction(billId)
 * Fungsi: Membuat Snap Token Midtrans untuk pembayaran.
 */
router.post("/midtrans/create-transaction", createMidtransTransaction);


export default router;