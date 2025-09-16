import MNotification from "../../models/notifikasi/MNotification.js";

export const getNotification = async (req, res) => {
  try {
    // Query notifikasi user tertentu, hanya ambil kolom yang diperlukan
    const notifications = await MNotification.findAll({
      raw: true,
    });

    return res.status(200).json({
      message: "Notifikasi berhasil diambil",
      data: notifications,
    });
  } catch (error) {
    console.error("Error getNotification:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
