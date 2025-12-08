// src/controllers/content/notifications/getNotificationList.js

import db from "../../models/index.js";
import { Op } from "sequelize";

// Mengambil model Notification
const Notification = db.Notification;

/**
 * Mengambil daftar notifikasi untuk pengguna, disinkronkan dengan skema DB terbaru.
 * MAPPING INPUT (Query to DB):
 * - status=1 (Frontend Belum Dibaca) -> DB status: 'unread'
 * - status=2 (Frontend Sudah Dibaca) -> DB status: 'read'
 * * MAPPING OUTPUT (DB to Response):
 * - DB title -> Response title
 * - DB content -> Response body
 * - DB status ('read'/'unread') -> Response status (2/1)
 */
const getNotificationList = async (req, res) => {
  try {
    // 1. Ambil Member ID (Prioritas dari Token/Middleware, Fallback ke Query)
    const authenticatedMemberId = req.user?.member_id; // Asumsi dari MidAnggota
    const queryMemberId = req.query.id;
    const memberId = authenticatedMemberId || queryMemberId;

    // 2. Ambil Query Parameter lainnya
    const statusFilter = req.query.status
      ? parseInt(req.query.status, 10)
      : null;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;

    // 3. Validasi Member ID
    if (!memberId) {
      return res.status(401).json({
        message:
          "Otorisasi gagal. ID Anggota tidak ditemukan di token otentikasi maupun query string (id).",
        list: [],
      });
    }

    // 4. Siapkan Kondisi WHERE
    const whereCondition = {
      member_id: memberId, // Filter wajib: member_id
    };

    // MAPPING Status Frontend (1/2) ke Status DB (string)
    if (statusFilter === 1) {
      // Status 1 (Belum Dibaca) -> DB status: 'unread'
      whereCondition.status = "unread";
    } else if (statusFilter === 2) {
      // Status 2 (Sudah Dibaca) -> DB status: 'read';
      whereCondition.status = "read";
    }

    // 5. Hitung Total Notifikasi yang Belum Dibaca (untuk Badge Count)
    const unreadCount = await Notification.count({
      where: {
        member_id: memberId,
        status: "unread", // Selalu hitung yang berstatus 'unread'
      },
    });

    // 6. Ambil Data Notifikasi dengan Pagination
    const { count, rows } = await Notification.findAndCountAll({
      where: whereCondition,
      // Mengambil kolom sesuai skema DB terbaru
      limit: limit,
      offset: offset,
      order: [["sent_datetime", "DESC"]], // Urutkan berdasarkan sent_datetime
      raw: true,
    });

    // 7. Transformasi Data untuk Kompatibilitas Frontend
    const list = rows.map((item) => ({
      // Mapping: DB Field -> Response Field
      id: item.notification_id,
      title: item.title, // title (DB) -> title (Response)
      body: item.content, // content (DB) -> body (Response)
      // Mapping status: 'read' -> 2, lainnya ('unread') -> 1
      status: item.status === "read" ? 2 : 1,
      // Waktu: Menggunakan sent_datetime atau fallback ke created_at
      created_at: item.sent_datetime || item.created_at,
    }));

    // 8. Kirim Respons Sukses
    return res.status(200).json({
      message: "Daftar notifikasi berhasil diambil.",
      total_count: count,
      unread_count: unreadCount,
      list: list,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil notifikasi:", error);
    return res.status(500).json({
      message: "Kesalahan server internal.",
      error: error.message,
    });
  }
};

export default getNotificationList;
