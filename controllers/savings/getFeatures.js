import db from "../../models/index.js";

export const getFeatures = async (req, res) => {
  try {
    const features = await db.FeatureConfig.findAll();
    return res.status(200).json({
      status: true,
      message: "Berhasil mendapatkan data fitur",
      data: features,
    });
  } catch (error) {
    console.error("Error getFeatures:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal mendapatkan data fitur",
      error: error.message,
    });
  }
};
