import express from "express";
import contentRoute from "./contentRoute.js";
import authRoute from "./authRoute.js";
import anggotaRoute from "./anggotaRoute.js";
import notificationRoute from "./notificationRoute.js";
import billingRoute from "./billingRoute.js";
import approvalsRoute from "./approvalsRoute.js";
import financialRoute from "./financialRoute.js";
import simpananRoute from "./simpananRoute.js";
import webhookRoute from "./webhookRoute.js";
const router = express.Router();
// ==========================================================
// ✅ Webhook harus didaftarkan PALING AWAL
router.use(webhookRoute);
// ==========================================================
router.use(contentRoute);
router.use(authRoute);
router.use(anggotaRoute);
router.use(notificationRoute);
router.use(billingRoute);
router.use(approvalsRoute);
router.use(financialRoute);
router.use(simpananRoute);
// router.use(importRoutes);

export default router;
