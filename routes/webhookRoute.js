// 📁 routes/webhookRoute.js
import express from "express";
// Path disesuaikan dengan folder baru: controllers/webhooks/
import { midtransNotification } from "../controllers/webhooks/midtransNotification.js";
import { irisNotification } from "../controllers/webhooks/irisWebhook.js";

const router = express.Router();

/**
 * Endpoint: POST /api/webhooks/midtrans
 * Digunakan oleh Midtrans untuk update status pembayaran (Billing)
 */
router.post("/midtrans/notification", midtransNotification);

/**
 * Endpoint: POST /api/webhooks/iris
 * Digunakan oleh Midtrans Iris untuk update status pencairan dana (Disbursement)
 */
router.post("/iris", irisNotification);

// Fallback untuk Method Not Allowed
router.get(["/midtrans/notification", "/iris"], (req, res) => {
  return res.status(405).json({
    success: false,
    message: "Method Not Allowed. Use POST for webhooks.",
  });
});

export default router;