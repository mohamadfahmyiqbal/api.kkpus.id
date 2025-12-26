import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import MidRole from "../middleware/MidRole.js";
import getPendingBills from "../controllers/content/billing/getPendingBills.js";
import { getInvoiceDetail } from "../controllers/billing/getInvoiceDetail.js";
import { createMidtransTransaction } from "../controllers/billing/createMidtransTransaction.js";
import getBillingHistory from "../controllers/content/billing/getBillingHistory.js";
import { createDepositSukarela } from "../controllers/billing/createDepositSukarela.js";
import { processSavingsPayment } from "../controllers/savings/processSavingsPayment.js";

const router = express.Router();

router.use(MidAnggota);
router.get("/list/pending", getPendingBills);
router.get("/list/history", getBillingHistory);
router.get("/invoice/:billId", getInvoiceDetail);
router.post("/create-deposit", createDepositSukarela);
router.post("/process-payment", createMidtransTransaction);
router.post("/process-savings", processSavingsPayment);

export default router;