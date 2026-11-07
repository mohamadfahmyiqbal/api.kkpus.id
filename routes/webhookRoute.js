import express from "express";
import { midtransNotification } from "../controllers/webhooks/midtransNotification.js";
import { irisNotification } from "../controllers/webhooks/irisNotification.js";
import { dokuNotification } from "../controllers/webhooks/dokuNotification.js";
import { verifyWebhookIp } from "../middleware/webhookSecurity.js";

const router = express.Router();

/**
 * Handle DOKU Notification (Direct VA, QRIS, Checkout)
 * Protected with IP Whitelist & Signature Verification
 * URL: /webhooks/doku/notification
 */
router.post("/doku/notification", verifyWebhookIp("doku"), dokuNotification);

/**
 * Handle Midtrans Core API (Payments/Billing)
 * Protected with IP Whitelist & Cryptographic Signature Check (SHA-512)
 * URL: /webhooks/midtrans/notification
 */
router.post("/midtrans/notification", verifyWebhookIp("midtrans"), midtransNotification);

/**
 * Handle Midtrans Iris (Disbursements)
 * Protected with IP Whitelist
 * URL: /webhooks/iris
 */
router.post("/iris", verifyWebhookIp("midtrans"), irisNotification);

/**
 * Fallback & Security
 */
router.all(["/doku/notification", "/midtrans/notification", "/iris"], (req, res, next) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed. Use POST for webhooks.",
    });
  }
  next();
});

export default router;