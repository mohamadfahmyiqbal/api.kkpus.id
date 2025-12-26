import express from "express";
import authRoute from "./authRoute.js";
import anggotaRoute from "./anggotaRoute.js";
import notificationRoute from "./notificationRoute.js";
import billingRoute from "./billingRoute.js";
import approvalsRoute from "./approvalsRoute.js";
import simpananRoute from "./simpananRoute.js";
import webhookRoute from "./webhookRoute.js";
import financialRoute from "./financialRoute.js";
import contentRoute from "./contentRoute.js";

const router = express.Router();

// 1. Webhook (Tanpa Prefix /api jika dari Midtrans langsung)
router.use("/webhooks", webhookRoute);

// 2. Gunakan prefix yang bersih
router.use("/api/auth", authRoute);
router.use("/api/anggota", anggotaRoute);
router.use("/api/notifikasi", notificationRoute);
router.use("/api/billing", billingRoute);
router.use("/api/approvals", approvalsRoute);
router.use("/api/simpanan", simpananRoute);
router.use("/api/financial", financialRoute);
router.use("/api/content", contentRoute);

export default router;