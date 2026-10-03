import express from "express";
import { midtransNotification } from "../controllers/webhooks/midtransNotification.js";
import { irisNotification } from "../controllers/webhooks/irisNotification.js";

const router = express.Router();

/**
 * Handle Midtrans Core API (Payments/Billing)
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
router.all(["/midtrans/notification", "/iris"], (req, res, next) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method Not Allowed. Use POST for webhooks.",
    });
  }
  next();
});

export default router;