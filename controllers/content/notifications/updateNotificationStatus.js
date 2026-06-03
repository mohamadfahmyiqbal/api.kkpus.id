// src/controllers/content/notifications/updateNotificationStatus.js

import db from "../../../models/index.js";
import { Op } from "sequelize";
import { NOTIFICATION_STATUS, REVERSE_STATUS_MAPPING } from "../../../constants/notificationConstants.js";

const Notification = db.Notification;

/**
 * Menandai notifikasi menjadi sudah dibaca ('read') di database.
 * Mendukung multiple status updates dan proper validation.
 */
export const updateNotificationStatus = async (req, res) => {
  const authenticatedMemberId = req.user?.member_id;
  const { id: notificationIds, status } = req.body; // Support single ID or array

  if (!authenticatedMemberId) {
    return res
      .status(401)
      .json({ message: "Otorisasi gagal. ID Anggota tidak ditemukan." });
  }

  if (!notificationIds || (Array.isArray(notificationIds) && notificationIds.length === 0)) {
    return res.status(400).json({ message: "ID notifikasi wajib diisi." });
  }

  try {
    // Normalize notification IDs to array
    const idsArray = Array.isArray(notificationIds) ? notificationIds : [notificationIds];
    
    // Determine target status
    let targetStatus = NOTIFICATION_STATUS.READ; // Default to read
    
    if (status !== undefined) {
      const mappedStatus = REVERSE_STATUS_MAPPING[parseInt(status)];
      if (mappedStatus) {
        targetStatus = mappedStatus;
      } else {
        return res.status(400).json({ 
          message: "Status tidak valid", 
          valid_statuses: Object.keys(REVERSE_STATUS_MAPPING) 
        });
      }
    }

    // Build where condition
    const whereCondition = {
      notification_id: { [Op.in]: idsArray },
      member_id: authenticatedMemberId,
    };

    // Only update from current status if specified
    if (req.query.from_status) {
      const fromStatus = REVERSE_STATUS_MAPPING[parseInt(req.query.from_status)];
      if (fromStatus) {
        whereCondition.status = fromStatus;
      }
    }

    // Update notifications
    const [updatedRows] = await Notification.update(
      { status: targetStatus },
      {
        where: whereCondition,
      }
    );

    return res.status(200).json({
      message: `${updatedRows} notifikasi berhasil diperbarui menjadi '${targetStatus}'.`,
      count: updatedRows,
      status: targetStatus,
      updated_ids: idsArray.slice(0, updatedRows) // Return only actually updated IDs
    });
  } catch (error) {
    console.error("Gagal memperbarui status notifikasi:", error);
    return res.status(500).json({ 
      message: "Kesalahan server internal.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default updateNotificationStatus;
