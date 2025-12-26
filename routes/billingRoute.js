import express from "express";
import { MidAnggota } from "../midlleware/MidAnggota.js";
import MidRole from "../midlleware/MidRole.js"; // Import MidRole untuk proteksi Bendahara

// Import Controllers (Existing)
import getPendingBills from "../controllers/content/billing/getPendingBills.js";
import { getInvoiceDetail } from "../controllers/billing/getInvoiceDetail.js";
import { createMidtransTransaction } from "../controllers/billing/createMidtransTransaction.js";
import getBillingHistory from "../controllers/content/billing/getBillingHistory.js";
import { createDepositSukarela } from "../controllers/billing/createDepositSukarela.js";
import { processSavingsPayment } from "../controllers/savings/processSavingsPayment.js";

// 🚨 NEW: Import Controller Disbursement Bendahara
import { disburseWithdrawal } from "../controllers/savings/disburseWithdrawal.js";

const router = express.Router();

/**
 * 1. PUBLIC ROUTES (Tanpa Middleware)
 * Endpoint untuk Webhook Midtrans agar status otomatis update (PAID/FAILED)
 */
// router.post("/midtrans/notification", handleMidtransNotification);

// --- PROTECTED ROUTES (Hanya Anggota & Staff) ---
router.use(MidAnggota);

/**
 * 2. ALUR PEMBAYARAN ANGGOTA (Anggota Bayar Tagihan)
 */
router.get("/list/pending", getPendingBills);
router.get("/list/history", getBillingHistory);
router.get("/:billId", getInvoiceDetail);
router.post("/create-deposit", createDepositSukarela);
router.post("/midtrans/create-transaction", createMidtransTransaction);
router.post("/midtrans/process-savings", processSavingsPayment);

/**
 * 3. 🚨 ALUR BENDAHARA (Pencairan Dana via Midtrans Iris)
 * Menggunakan MidRole agar hanya user dengan role 'Bendahara' yang bisa akses.
 */
router.post(
  "/penarikan/bayar/:withdrawal_id", 
  MidRole(["Bendahara"]), 
  disburseWithdrawal
);

export default router;