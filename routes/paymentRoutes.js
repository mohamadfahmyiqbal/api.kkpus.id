import express from "express";
import { disburseWithdrawal } from "../controllers/savings/disburseWithdrawal.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Bendahara mengeksekusi pembayaran penarikan
 * Endpoint final:
 * POST /api/payment/disburse/:withdrawal_id
 */
router.post(
  "/disburse/:withdrawal_id",
  verifyUser,
  disburseWithdrawal
);

export default router;
