import MAnggota from "../../models/anggota/MAnggota.js";
import MApprovalRequest from "../../models/approval/MApprovalRequest.js";

export const getApprovalRequestByToken = async (req, res) => {
  const { ret, token } = req.body;

  if (!token) {
    if (ret === "ret") return false;
    return res.status(400).json({ message: "Token wajib diisi" });
  }

  try {
    const approvalRequests = await MApprovalRequest.findAll({
      where: { token },
      include: [
        {
          model: MAnggota,
          as: "requesterAnggota",
          attributes: { exclude: ["token", "password"] },
        },
        {
          model: MAnggota,
          as: "approverAnggota",
          attributes: { exclude: ["token", "password"] },
        },
      ],
      raw: true,
      nest: true,
    });

    // Tambahkan penanganan jika tidak ada permintaan persetujuan ditemukan
    if (!approvalRequests || approvalRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "Tidak ada permintaan persetujuan ditemukan" });
    }

    // Kembalikan data permintaan persetujuan
    if (ret === "ret") return approvalRequests;
    return res.status(200).json({
      message: "Berhasil mengambil permintaan persetujuan",
      data: approvalRequests,
    });
  } catch (error) {
    console.error("Error getApprovalRequestByToken:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
