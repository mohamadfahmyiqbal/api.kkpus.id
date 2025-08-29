import MAnggota from "../../models/anggota/MAnggota.js";
import MApprovalRequest from "../../models/approval/MApprovalRequest.js";
import { MApprovalFlow } from "../../models/index.js";

export const getApprovalRequestByNik = async (req, res) => {
  const { nik } = req.body;

  if (!nik) {
    return res.status(400).json({ message: "NIK wajib diisi" });
  }

  try {
    // Ambil semua approval request yang statusnya pending
    const approvalRequests = await MApprovalRequest.findAll({
      where: {
        status: "pending",
      },
      attributes: ["id", "type", "flow", "status", "created_at", "updated_at"],
      include: [
        {
          model: MAnggota,
          as: "requester",
          attributes: ["nik", "nama", "email"], // hanya ambil kolom penting
        },
      ],
      order: [["created_at", "DESC"]],
      raw: false, // gunakan false agar relasi bisa diakses
    });

    // Filter approvalRequests yang memang harus di-approve oleh nik ini di level flow-nya
    const filteredRequests = [];
    for (const apr of approvalRequests) {
      const flow = await MApprovalFlow.findOne({
        where: {
          level: apr.flow,
          approver_id: nik,
          type: apr.type,
        },
      });
      if (flow) {
        // Tambahkan info flow jika perlu
        filteredRequests.push({
          ...apr.toJSON(),
          flowInfo: flow.toJSON(),
        });
      }
    }

    return res.status(200).json({
      message: "Data approval request berhasil diambil",
      data: filteredRequests,
    });
  } catch (error) {
    console.error("Error getApprovalRequestByNik:", error);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
