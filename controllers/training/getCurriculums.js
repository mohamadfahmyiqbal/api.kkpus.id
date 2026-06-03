import db from "../../models/index.js";

const getCurriculums = async (req, res) => {
  try {
    const { type } = req.query;

    const whereClause = { is_active: true };
    if (type && ['WAJIB', 'REGULER'].includes(type)) {
      whereClause.curriculum_type = type;
    }

    const curriculums = await db.Curriculum.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      status: true,
      message: "Daftar kurikulum berhasil diambil",
      data: curriculums
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export { getCurriculums };
