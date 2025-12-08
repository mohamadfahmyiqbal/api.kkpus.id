// src/controllers/content/notifications/getNotificationByNik.js

// 🔥 FIX PATH: Ubah dari "../../../../models/index.js" menjadi "../../../models/index.js"
import db from "../../../models/index.js";
import { Sequelize } from "sequelize";

const Notification = db.Notification;
const Member = db.Member;
const Op = Sequelize.Op;

/**
 * Mengambil daftar notifikasi berdasarkan NIK (Nomor Anggota) yang ada di Token.
 * @param {Object} req - Objek request Express
 * @param {Object} res - Objek response Express
 */
export const getNotificationByNik = async (req, res) => {
  console.log(req.body);

  const memberId = req.userId;
  const { status } = req.query;

  try {
    const member = await Member.findOne({
      where: { member_id: memberId },
      attributes: ["member_no"],
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Data Anggota tidak ditemukan.",
      });
    }

    const memberNo = member.member_no;

    const whereCondition = {
      recipient_nik: memberNo,
    };

    if (status) {
      whereCondition.status = {
        [Op.in]: Array.isArray(status) ? status : [status],
      };
    } else {
      whereCondition.status = 1;
    }

    const notifications = await Notification.findAll({
      where: whereCondition,
      order: [["created_at", "DESC"]],
      limit: 10,
    });

    return res.status(200).json({
      success: true,
      message: "Daftar notifikasi berhasil diambil.",
      data: notifications,
    });
  } catch (error) {
    console.error("Kesalahan API getNotificationByNik:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil notifikasi karena kesalahan server.",
    });
  }
};
