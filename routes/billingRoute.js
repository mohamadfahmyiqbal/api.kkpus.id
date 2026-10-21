import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";
import getPendingBills from "../controllers/billing/getPendingBills.js";
import { getInvoiceDetail } from "../controllers/billing/getInvoiceDetail.js";
import { createMidtransTransaction } from "../controllers/billing/createMidtransTransaction.js";
import { createDokuTransaction } from "../controllers/billing/createDokuTransaction.js";
import getBillingHistory from "../controllers/billing/getBillingHistory.js";
import { createDepositSukarela } from "../controllers/billing/createDepositSukarela.js";
import { processSavingsPayment } from "../controllers/savings/processSavingsPayment.js";
import { createVoluntaryBill } from "../controllers/billing/createVoluntaryBill.js";
import { syncMidtransStatus } from "../controllers/billing/syncMidtransStatus.js";
import { manualSyncSummary } from "../controllers/billing/manualSyncSummary.js";
import { getPaymentFeeConfigs, updatePaymentFeeConfigs } from "../controllers/billing/paymentFeeConfigController.js";
import {
  getCooperativeBankAccounts,
  uploadPaymentProofMiddleware,
  submitManualPayment,
  verifyManualPayment,
  getPendingVerificationPayments,
} from "../controllers/billing/manualPaymentController.js";

const router = express.Router();

router.get("/payment-fees", getPaymentFeeConfigs);
router.put("/payment-fees", MidAnggota, MidRole(["Admin", "Super Admin"]), updatePaymentFeeConfigs);

// Daftar Rekening Koperasi untuk Pembayaran Manual
router.get("/cooperative-banks", getCooperativeBankAccounts);

// Admin / Bendahara Verifikasi Pembayaran Manual
router.get("/manual-verifications", MidAnggota, MidRole(["Admin", "Super Admin", "Bendahara"]), getPendingVerificationPayments);
router.post("/verify-manual-payment", MidAnggota, MidRole(["Admin", "Super Admin", "Bendahara"]), verifyManualPayment);

router.use(MidAnggota);
router.get("/list/pending", getPendingBills);
router.get("/list/history", getBillingHistory);
router.post("/invoice/details", getInvoiceDetail);
router.post("/create-voluntary-bill", createVoluntaryBill);
router.post("/create-deposit", createDepositSukarela);
router.post("/process-payment", MidAnggota, createDokuTransaction);
router.post("/manual-payment", uploadPaymentProofMiddleware, submitManualPayment);
router.post("/process-savings", processSavingsPayment);
router.post("/sync-status", syncMidtransStatus);
router.post("/manual-sync-summary", manualSyncSummary);

export default router;