import db from "../../models/index.js";

const getMaterials = async (req, res) => {
  try {
    const { curriculum_id } = req.params;
    const memberId = req.userId;

    const materials = await db.Material.findAll({
      where: { 
        curriculum_id: curriculum_id,
        is_unlocked: true
      },
      order: [['order_index', 'ASC']],
      include: [
        {
          model: db.MaterialNote,
          where: { member_id: memberId },
          required: false
        },
        {
          model: db.Evaluation,
          where: { member_id: memberId },
          required: false
        }
      ]
    });

    return res.status(200).json({
      status: true,
      message: "Daftar materi berhasil diambil",
      data: materials
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

const getMaterialDetail = async (req, res) => {
  try {
    const { material_id } = req.params;
    const memberId = req.userId;

    const material = await db.Material.findOne({
      where: { material_id: material_id },
      include: [
        {
          model: db.MaterialNote,
          where: { member_id: memberId },
          required: false
        },
        {
          model: db.Evaluation,
          where: { member_id: memberId },
          required: false
        }
      ]
    });

    if (!material) {
      return res.status(404).json({
        status: false,
        message: "Materi tidak ditemukan"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Detail materi berhasil diambil",
      data: material
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export { getMaterials, getMaterialDetail };
