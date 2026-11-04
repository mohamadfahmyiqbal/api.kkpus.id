import db from "../../models/index.js";
import { isAllowedAkad } from "./configValidation.js";

export const updateFeatureAkad = async (req, res) => {
  try {
    const { id } = req.params;
    const { akad_type } = req.body;

    if (!isAllowedAkad(akad_type)) {
      return res.status(400).json({
        status: false,
        message: "Tipe akad tidak valid",
      });
    }

    const feature = await db.FeatureConfig.findByPk(id);
    if (!feature) {
      return res.status(404).json({ status: false, message: "Feature not found" });
    }

    const previousAkad = feature.akad_type;
    await feature.update({ akad_type });

    console.info("[config] feature akad updated", {
      actor: req.userId || null,
      featureId: id,
      from: previousAkad,
      to: akad_type,
    });

    return res.status(200).json({
      status: true,
      message: "Akad berhasil diupdate",
      data: feature,
    });
  } catch (error) {
    console.error("Error updateFeatureAkad:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal update akad",
    });
  }
};
