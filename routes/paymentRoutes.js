import express from "express";
import { disburseWithdrawal } from "../controllers/savings/disburseWithdrawal.js";
import { irisNotification } from "../controllers/savings/irisWebhook.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Endpoint untuk Bendahara mengeksekusi bayar
router.post("/disburse/:withdrawal_id", verifyUser, disburseWithdrawal);

// Endpoint Public untuk Webhook Midtrans Iris (Jangan pakai verifyUser)
router.post("/webhooks/iris", irisNotification);

export default router;