import MAnggota from "../../models/anggota/MAnggota.js";
import MApprovalRequest from "../../models/approval/MApprovalRequest.js";
import { MApprovalFlow } from "../../models/index.js";

export const getApprovalRequestByNik = async (req, res) => {
  const { nik } = req.anggota;

  if (!nik) {
    return res.status(400).json({ message: "NIK wajib diisi" });
  }

  try {
    const approvalRequests = await MApprovalRequest.findAll({
      where: { status: "pending" },
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
    // Filter hanya approvalRequest yang approverAnggota.nik === nik
    const filteredApprovalRequests = approvalRequests.filter(
      (req) => req.approverAnggota && req.approverAnggota.nik === nik
    );
    // console.log(approvalRequests);
    return res.status(200).json({
      message: "Data approval request berhasil diambil",
      data: filteredApprovalRequests,
    });
  } catch (error) {
    console.error("Error getApprovalRequestByNik:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
