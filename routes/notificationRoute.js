// src/routes/notificationRoute.js

import express from "express";
import { MidAnggota } from "../midlleware/MidAnggota.js"; // Middleware Otorisasi
import { updateNotificationStatus } from "../controllers/content/notifications/updateNotificationStatus.js";
import getNotificationList from "../controllers/notification/getNotificationList.js";

const router = express.Router();

// Semua rute notifikasi memerlukan otorisasi anggota
router.use("/notifikasi", MidAnggota);

/**
 * Endpoint: GET /api/notifikasi/list
 * Digunakan oleh: UNotification.getNotificationByNik()
 * Fungsi: Mengambil daftar notifikasi anggota.
 */
router.get("/notifikasi/list", getNotificationList);

/**
 * Endpoint: POST /api/notifikasi/update-status
 * Digunakan oleh: UNotification.markAsRead()
 * Fungsi: Menandai satu atau beberapa notifikasi sudah dibaca.
 */
router.post("/notifikasi/update-status", updateNotificationStatus);

// Tambahkan rute untuk detail notifikasi jika diperlukan (misalnya: /notifikasi/detail/:id)

export default router;
