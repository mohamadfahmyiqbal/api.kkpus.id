// src/controllers/content/notifications/getNotificationList.js
import db from "../../models/index.js";
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

    const whereCondition = { member_id: memberId };

    // Mapping Status dari tabel Anda (SENT)
    // Jika status=1 (unread) dikirim dari frontend, kita cari yang statusnya 'SENT'
    if (req.query.status == 1) {
      whereCondition.status = "SENT";
    }

    const { count, rows } = await Notification.findAndCountAll({
      where: whereCondition,
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
      order: [["sent_datetime", "DESC"]], // Sesuai kolom tabel Anda
      raw: true,
    });

    // Transformasi ke format Frontend
    const list = rows.map((item) => ({
      id: item.notification_id, // bigint (PK)
      title: item.title, // varchar(255)
      body: item.content, // text
      status: item.status === "SENT" ? 1 : 2, // SENT dianggap unread (1)
      sent_at: item.sent_datetime, // datetime
    }));

    return res.status(200).json({
      message: "Success",
      total_count: count,
      list: list,
    });
  } catch (error) {
    console.error("Notification Error:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

export default getNotificationList; // ✅ Export Default
