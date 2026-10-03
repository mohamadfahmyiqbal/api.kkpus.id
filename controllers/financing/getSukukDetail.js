import db from "../../models/index.js";

const getSukukDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID Sukuk diperlukan",
      });
    }

    const sukuk = await db.SukukIssue.findOne({
      where: { issue_id: id },
    });

    if (!sukuk) {
      return res.status(404).json({
        success: false,
        message: "Sukuk tidak ditemukan",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Berhasil mendapatkan detail sukuk",
      data: sukuk,
    });
  } catch (error) {
    console.error("Error in getSukukDetail:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

export default getSukukDetail;
