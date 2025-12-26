// 📁 src/routes/notificationRoute.js

import express from "express";
import { MidAnggota } from "../middleware/MidAnggota.js"; // Pastikan ejaan folder 'midlleware' sesuai
import { updateNotificationStatus } from "../controllers/content/notifications/updateNotificationStatus.js";
import getNotificationList from "../controllers/notification/getNotificationList.js";

const router = express.Router();

// Semua rute di file ini memerlukan login (Token JWT)
router.use(MidAnggota);

/**
 * GET /api/notifikasi/list
 * Mengambil riwayat notifikasi dari Database
 */
router.get("/list", getNotificationList);

/**
 * POST /api/notifikasi/update-status
 * Menandai notifikasi sebagai "Read"
 */
router.post("/update-status", updateNotificationStatus);

export default router;