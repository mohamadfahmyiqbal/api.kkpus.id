import MTrans from "../../models/transaksi/MTrans.js";
import { Op } from "sequelize";

export const findTransByJenis = async (req, res) => {
  try {
    const { ret, jenis } = req.body;

    // ✅ Validasi input
    if (!jenis || typeof jenis !== "string") {
      const msg = "Parameter 'jenis' wajib diisi dan harus berupa string";
      if (ret === "ret") return { success: false, message: msg };
      return res.status(400).json({ success: false, message: msg });
    }

    // ✅ Query efisien dan aman
    const data = await MTrans.findAll({
      where: {
        jenis: {
          [Op.eq]: jenis.trim(),
        },
      },
      include: [{ association: "invoiceTrans" }],
      order: [["createdAt", "DESC"]], // urutkan dari terbaru jika ada kolom createdAt
      raw: true,
      nest: true,
    });

    // ✅ Jika dipanggil dari fungsi lain (ret === "ret")
    if (ret === "ret") {
      return {
        success: true,
        total: data.length,
        data,
      };
    }

    // ✅ Jika dipanggil via HTTP request
    return res.status(200).json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    console.error("findTransByJenis Error:", error);

    if (req.body?.ret === "ret") {
      return {
        success: false,
        message: "Terjadi kesalahan saat mengambil data transaksi",
        error: error.message,
      };
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
