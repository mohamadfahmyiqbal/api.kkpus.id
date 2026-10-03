// src/controllers/content/notifications/getNotificationList.js
import db from "../../models/index.js";
import { NOTIFICATION_STATUS, NOTIFICATION_LIMITS, STATUS_MAPPING, REVERSE_STATUS_MAPPING } from "../../constants/notificationConstants.js";
const Notification = db.Notification;

const getNotificationList = async (req, res) => {
  try {
    // Member ID dari token (req.userId) atau query string
    const memberId = req.userId || req.query.member_id;

    if (!memberId) {
      return res
        .status(401)
        .json({ message: "Otorisasi Gagal: ID tidak ditemukan" });
    }

    // Validate and sanitize pagination parameters
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || NOTIFICATION_LIMITS.DEFAULT_LIMIT, 1),
      NOTIFICATION_LIMITS.MAX_LIMIT
    );
    const offset = Math.max(parseInt(req.query.offset) || NOTIFICATION_LIMITS.DEFAULT_OFFSET, 0);

    const whereCondition = { member_id: memberId };

    // Handle status filtering with proper mapping
    if (req.query.status !== undefined) {
      const frontendStatus = parseInt(req.query.status);
      const backendStatus = REVERSE_STATUS_MAPPING[frontendStatus];
      
      if (backendStatus) {
        whereCondition.status = backendStatus;
      } else {
        // Invalid status parameter
        return res.status(400).json({ 
          message: "Parameter status tidak valid", 
          valid_statuses: Object.keys(REVERSE_STATUS_MAPPING) 
        });
      }
    }

    const { count, rows } = await Notification.findAndCountAll({
      where: whereCondition,
      limit: limit,
      offset: offset,
      order: [["sent_datetime", "DESC"]],
      raw: true,
    });

    // Transformasi ke format Frontend dengan proper status mapping
    const list = rows.map((item) => {
      const frontendStatus = STATUS_MAPPING[item.status] || 1; // Default to unread
      return {
        id: item.notification_id,
        title: item.title,
        body: item.content,
        status: frontendStatus,
        sent_at: item.sent_datetime,
      };
    });

    return res.status(200).json({
      message: "Success",
      total_count: count,
      current_page: Math.floor(offset / limit) + 1,
      total_pages: Math.ceil(count / limit),
      has_next: offset + limit < count,
      has_prev: offset > 0,
      list: list,
    });
  } catch (error) {
    console.error("Notification Error:", error);
    return res
      .status(500)
      .json({ 
        message: "Server Error", 
        error: process.env.NODE_ENV === 'development' ? error.message : "Internal server error"
      });
  }
};

export default getNotificationList; // ✅ Export Default
