import express from "express";
import authRoute from "./authRoute.js";
import forgotPasswordRoute from "./forgotPasswordRoute.js";
import approvalsRoute from "./approvalsRoute.js";
import anggotaRoute from "./anggotaRoute.js";
import notificationRoute from "./notificationRoute.js";
import billingRoute from "./billingRoute.js";
import simpananRoute from "./simpananRoute.js";
import webhookRoute from "./webhookRoute.js";
import financialRoute from "./financialRoute.js";
import contentRoute from "./contentRoute.js";
import pushRoutes from "./pushRoutes.js";
import regionRoutes from "./regionRoutes.js";
import midtransRoutes from "./midtrans.js";
import programRoute from "./programRoute.js";
import financingRoute from "./financingRoute.js";
import jualbeliRoute from "./jualbeliRoute.js";
import savingsRoute from "./savingsRoute.js";
import dashboardRoute from "./dashboardRoute.js";
import trainingRoute from "./trainingRoute.js";
import landingRoute from "./landingRoute.js";
import tabunganRoute from "./tabunganRoute.js";

const router = express.Router();

// API Routes
router.use("/webhooks", webhookRoute);
router.use("/api/approvals", approvalsRoute);
router.use("/api/auth/forgot-password", forgotPasswordRoute);
router.use("/api/auth", authRoute);
router.use("/api/anggota", anggotaRoute);
router.use("/api/notifikasi", notificationRoute);
router.use("/api/billing", billingRoute);
router.use("/api/simpanan", simpananRoute);
router.use("/api/financial", financialRoute);
router.use("/api/content", contentRoute);
router.use("/api/push", pushRoutes);
router.use("/api/regions", regionRoutes);
router.use("/api/midtrans", midtransRoutes);
router.use("/api/program", programRoute);
router.use("/api/financing", financingRoute);
router.use("/api/jualbeli", jualbeliRoute);

router.use("/api/savings", savingsRoute);
router.use("/api/dashboard", dashboardRoute);
router.use("/api/training", trainingRoute);
router.use("/api/landing", landingRoute);
router.use("/api/tabungan", tabunganRoute);

// Direct alias for push notification subscribe
router.use("/push", pushRoutes);

export default router;

