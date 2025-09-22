import { Op } from "sequelize";
import MNotification from "../../models/notifikasi/MNotification.js";

export const getNotificationByNik = async (req, res) => {
  const { nik } = req.anggota;
  let { status } = req.body;

  if (!nik) {
    return res.status(400).json({ message: "NIK tidak boleh kosong" });
  }

  try {
    // normalisasi status agar selalu array
    if (!Array.isArray(status)) {
      status = status !== undefined ? [status] : [];
    }

    const notifications = await MNotification.findAll({
      where: {
        user_id: nik,
        ...(status.length > 0 && { is_read: { [Op.in]: status } }),
      },
      raw: true,
    });

    return res.status(200).json({
      message: "Notifikasi berhasil diambil",
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Error getNotificationByNik:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
