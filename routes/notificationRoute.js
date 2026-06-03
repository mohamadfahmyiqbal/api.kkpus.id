// 📁 src/routes/notificationRoute.js

import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js";
import { updateNotificationStatus } from "../controllers/content/notifications/updateNotificationStatus.js";
import getNotificationList from "../controllers/notification/getNotificationList.js";

const router = express.Router();


// --- SEMUA DI BAWAH INI MEMERLUKAN LOGIN ---
router.use(MidAnggota);

/**
 * 🔒 RUTE PROTEKSI
 */
router.get("/list", getNotificationList);
router.post("/update-status", updateNotificationStatus);

export default router;