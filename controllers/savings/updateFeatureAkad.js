import db from "../../models/index.js";

export const updateFeatureAkad = async (req, res) => {
  try {
    const { id } = req.params;
    const { akad_type } = req.body;

    if (!akad_type) {
      return res.status(400).json({ status: false, message: "Akad type is required" });
    }

    const feature = await db.FeatureConfig.findByPk(id);
    if (!feature) {
      return res.status(404).json({ status: false, message: "Feature not found" });
    }

    await feature.update({ akad_type });

    return res.status(200).json({
      status: true,
      message: "Akad berhasil diupdate",
      data: feature
    });
  } catch (error) {
    console.error("Error updateFeatureAkad:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal update akad",
      error: error.message
    });
  }
};
