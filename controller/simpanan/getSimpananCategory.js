import MSimpananCategory from "../../models/simpanan/MSimpananCategory.js";

export const getSimpananCategory = async (req, res) => {
  try {
    const simpananCategories = await MSimpananCategory.findAll({
      attributes: ["id", "name", "category"],
    });

    return res.status(200).json(simpananCategories);
  } catch (error) {
    console.error("Error mendapatkan kategori simpanan:", error);
    return res.status(500).json({
      message: "Gagal mengambil kategori simpanan",
    });
  }
};
