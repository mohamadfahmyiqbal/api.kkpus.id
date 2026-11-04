import db from "../../models/index.js";
import { isAllowedAkad } from "./configValidation.js";

export const updateSavingsAkad = async (req, res) => {
  try {
    const { id } = req.params;
    const { akad_type } = req.body;

    if (!isAllowedAkad(akad_type)) {
      return res.status(400).json({
        status: false,
        message: "Tipe akad tidak valid",
      });
    }

    const product = await db.SavingsProduct.findByPk(id);
    if (!product) {
      return res.status(404).json({ status: false, message: "Savings product not found" });
    }

    const previousAkad = product.akad_type;
    await product.update({ akad_type });

    console.info("[config] savings akad updated", {
      actor: req.userId || null,
      productId: id,
      from: previousAkad,
      to: akad_type,
    });

    return res.status(200).json({
      status: true,
      message: "Akad berhasil diupdate",
      data: product,
    });
  } catch (error) {
    console.error("Error updateSavingsAkad:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal update akad",
    });
  }
};
