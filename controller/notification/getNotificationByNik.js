import MNotification from "../../models/notifikasi/MNotification.js";

export const getNotificationByNik = async (req, res) => {
  const { nik } = req.body;
  if (!nik) {
    return res.status(400).json({ message: "NIK tidak boleh kosong" });
  }
  try {
    // Ambil notifikasi yang belum dibaca untuk user dengan NIK tertentu
    const notifications = await MNotification.findAll({
      where: { is_read: 0 },
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
