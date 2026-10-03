import db from "../../models/index.js";

export const updateSavingsAkad = async (req, res) => {
  try {
    const { id } = req.params;
    const { akad_type } = req.body;

    if (!akad_type) {
      return res.status(400).json({ status: false, message: "Akad type is required" });
    }

    const product = await db.SavingsProduct.findByPk(id);
    if (!product) {
      return res.status(404).json({ status: false, message: "Savings product not found" });
    }

    await product.update({ akad_type });

    return res.status(200).json({
      status: true,
      message: "Akad berhasil diupdate",
      data: product
    });
  } catch (error) {
    console.error("Error updateSavingsAkad:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal update akad",
      error: error.message
    });
  }
};
