// 📁 src/routes/billingRoute.js (KOREKSI FINAL: Rute Notifikasi Harus Publik)

import express from "express";
import { MidAnggota } from "../midlleware/MidAnggota.js";
import getPendingBills from "../controllers/content/billing/getPendingBills.js";
// 🚨 NEW: Import controller untuk detail tagihan
import { getInvoiceDetail } from "../controllers/billing/getInvoiceDetail.js";
// 🚨 NEW: Import controller untuk Midtrans
import { createMidtransTransaction } from "../controllers/billing/createMidtransTransaction.js";
import getBillingHistory from "../controllers/content/billing/getBillingHistory.js";
import { createDepositSukarela } from "../controllers/billing/createDepositSukarela.js";
import { processSavingsPayment } from "../controllers/savings/processSavingsPayment.js";

const router = express.Router();

/**
 * ✅ KOREKSI: Rute Midtrans Notification Harus Diletakkan DI SINI
 * Rute ini bersifat publik (tidak memerlukan MidAnggota) agar Midtrans dapat mengirim webhook.
 */
// router.post("/midtrans/notification", midtransNotification);

// Middleware: Terapkan MidAnggota ke SEMUA rute DI BAWAH baris ini.
// Semua rute di bawah ini memerlukan otentikasi anggota.
router.use(MidAnggota);

/**
 * Endpoint: GET /list/pending (Dilindungi MidAnggota)
 */
router.get("/list/pending", getPendingBills);
router.get("/list/history", getBillingHistory);
/**
 * 🚨 NEW Endpoint: GET /:billId (Dilindungi MidAnggota)
 */
router.get("/:billId", getInvoiceDetail);
router.post("/create-deposit", createDepositSukarela);
/**
 * 🚨 NEW Endpoint: POST /midtrans/create-transaction (Dilindungi MidAnggota)
 * Rute ini WAJIB dilindungi MidAnggota karena menggunakan req.userId untuk membuat transaksi.
 */
router.post("/midtrans/create-transaction", createMidtransTransaction);
router.post("/midtrans/process-savings", processSavingsPayment);

export default router;
