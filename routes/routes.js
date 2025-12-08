import express from "express";
import contentRoute from "./contentRoute.js";
import authRoute from "./authRoute.js";
import anggotaRoute from "./anggotaRoute.js";
import notificationRoute from "./notificationRoute.js";
import billingRoute from "./billingRoute.js";
import approvalsRoute from "./approvalsRoute.js";

const router = express.Router();

router.use(contentRoute);
router.use(authRoute);
router.use(anggotaRoute);
router.use(notificationRoute);
router.use(billingRoute);
router.use(approvalsRoute);
// router.use(importRoutes);

export default router;
