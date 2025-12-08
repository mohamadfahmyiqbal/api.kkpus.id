// src/controllers/content/notifications/updateNotificationStatus.js

import db from "../../../models/index.js";
import { Op } from "sequelize";

const Notification = db.Notification;

/**
 * Menandai notifikasi menjadi sudah dibaca ('read') di database.
 */
export const updateNotificationStatus = async (req, res) => {
  // Asumsi: MidAnggota sudah memastikan pengguna login dan req.user tersedia.
  const authenticatedMemberId = req.user?.member_id;
  const { id: notificationIds } = req.body; // Menerima array ID notifikasi

  if (!authenticatedMemberId) {
    return res
      .status(401)
      .json({ message: "Otorisasi gagal. ID Anggota tidak ditemukan." });
  }

  if (!notificationIds || notificationIds.length === 0) {
    return res.status(400).json({ message: "ID notifikasi wajib diisi." });
  }

  try {
    // ✅ Perbarui field 'status' menjadi 'read'
    const [updatedRows] = await Notification.update(
      { status: "read" },
      {
        where: {
          notification_id: {
            [Op.in]: Array.isArray(notificationIds)
              ? notificationIds
              : [notificationIds],
          },
          member_id: authenticatedMemberId, // Filter berdasarkan anggota
          status: "unread", // Hanya perbarui yang statusnya 'unread'
        },
      }
    );

    return res.status(200).json({
      message: `${updatedRows} notifikasi berhasil ditandai sebagai sudah dibaca.`,
      count: updatedRows,
    });
  } catch (error) {
    console.error("Gagal memperbarui status notifikasi:", error);
    return res.status(500).json({ message: "Kesalahan server internal." });
  }
};

export default updateNotificationStatus;
