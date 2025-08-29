import MApprovalFlow from "../../models/approval/MApprovalFlow.js";

export const getApprovalFlowByType = async (req, res) => {
  const { ret, type } = req.body;

  try {
    if (!type) {
      return res.status(400).json({ message: "Parameter 'type' wajib diisi." });
    }

    const approvalFlows = await MApprovalFlow.findAll({
      raw: true,
      nest: true,
      where: { type },
      order: [["level", "ASC"]],
    });

    if (ret === "ret") {
      // Jika hanya ingin mengembalikan data (bukan response express)
      return approvalFlows;
    } else {
      return res.status(200).json(approvalFlows);
    }
  } catch (error) {
    console.error("Terjadi kesalahan pada getApprovalFlowByType:", error);
    if (ret === "ret") {
      // Jika mode ret, kembalikan error dalam bentuk objek
      return {
        error: true,
        message: "Terjadi kesalahan pada server.",
        detail: error.message,
      };
    } else {
      return res
        .status(500)
        .json({ message: "Terjadi kesalahan pada server." });
    }
  }
};
