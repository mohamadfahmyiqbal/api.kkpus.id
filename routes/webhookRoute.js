import express from "express";
import { midtransNotification } from "../controllers/webhooks/midtransNotification.js";
import { irisNotification } from "../controllers/webhooks/irisNotification.js";
import { dokuNotification } from "../controllers/webhooks/dokuNotification.js";

const router = express.Router();

/**
 * Handle DOKU Notification (Direct VA, QRIS, Checkout)
 * URL: /webhooks/doku/notification
 */
router.post("/doku/notification", dokuNotification);

/**
 * Handle Midtrans Core API (Payments/Billing) - Fallback
 * URL: /webhooks/midtrans/notification
 */
router.post("/midtrans/notification", midtransNotification);

/**
 * Handle Midtrans Iris (Disbursements)
 * URL: /webhooks/iris
 */
router.post("/iris", irisNotification);

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