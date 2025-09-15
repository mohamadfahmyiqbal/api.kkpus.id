import MNotification from "../../models/notifikasi/MNotification.js";

export const manageNotification = async (req, res) => {
  const { id } = req.body;
  try {
    const upd = await MNotification.update({ is_read: 1 }, { where: { id } });
    console.log(upd);

    return res.status(200).json({ message: "Notifikasi berhasil diperbarui" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
