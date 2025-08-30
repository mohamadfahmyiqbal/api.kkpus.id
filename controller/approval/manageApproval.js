import MApprovalRequest from "../../models/approval/MApprovalRequest.js";
import MNotification from "../../models/notifikasi/MNotification.js";

export const manageApproval = async (req, res) => {
  const { nik, nama } = req.anggota;
  const { btn, id } = req.body;

  // Validasi parameter
  if (!btn || !id) {
    return res
      .status(400)
      .json({ message: "Parameter btn dan id wajib diisi." });
  }

  if (!["approved", "rejected"].includes(btn)) {
    return res.status(400).json({ message: "Status approval tidak valid." });
  }

  try {
    // Cari approval request berdasarkan ID
    const approval = await MApprovalRequest.findOne({ where: { id } });

    if (!approval) {
      return res
        .status(404)
        .json({ message: "Approval request tidak ditemukan." });
    }

    if (approval.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Approval request sudah diproses." });
    }

    // Update approval request
    const [updated] = await MApprovalRequest.update(
      {
        approver: nik,
        status: btn,
        updated_at: new Date(),
      },
      {
        where: { id },
      }
    );

    if (updated === 0) {
      return res
        .status(500)
        .json({ message: "Gagal memperbarui approval request." });
    }

    // Buat notifikasi ke requester
    try {
      await MNotification.create({
        user_id: approval.requester_id,
        type: approval.type,
        title:
          btn === "approved" ? "Permintaan Disetujui" : "Permintaan Ditolak",
        body: `Permintaan Anda dengan ID ${id} telah ${
          btn === "approved" ? "disetujui" : "ditolak"
        } oleh ${nama}`,
        data: { approval_id: id, status: btn },
        is_read: false,
        created_at: new Date(),
      });
    } catch (notifErr) {
      // Notifikasi gagal, tapi approval tetap berhasil
      console.error("Gagal membuat notifikasi:", notifErr);
    }

    return res.status(200).json({
      message: `Approval request berhasil di${
        btn === "approved" ? "setujui" : "tolak"
      }.`,
      status: btn,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};
