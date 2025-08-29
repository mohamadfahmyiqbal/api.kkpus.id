import MApprovalRequest from "../../models/approval/MApprovalRequest.js";

export const getApprovalByNikAndType = async (req, res) => {
  const { nik, type } = req.body;

  if (!nik) {
    return res.status(400).json({
      success: false,
      message: "NIK wajib diisi.",
    });
  }

  try {
    // Ambil semua approval request berdasarkan NIK dan type, urutkan terbaru dulu
    const whereClause = { requester_id: nik, type };
    if (type) {
      whereClause.type = type;
    }

    // Menggunakan findAll agar bisa mengembalikan banyak data jika ada
    const approvals = await MApprovalRequest.findOne({
      where: whereClause,
    });

    if (!approvals || approvals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data approval tidak ditemukan untuk NIK tersebut.",
      });
    }

    return res.status(200).json(approvals);
  } catch (error) {
    console.error("getApprovalByNik error:", error);
    return res.status(500).json({
      message: `Terjadi kesalahan pada server: ${error.message}`,
    });
  }
};
