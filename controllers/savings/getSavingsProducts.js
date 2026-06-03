// src/controllers/savings/getSavingsProducts.js
import db from "../../models/index.js";

export const getSavingsProducts = async (req, res) => {
  try {
    const products = await db.SavingsProduct.findAll({
      // [nama_kolom_di_db, nama_alias_untuk_frontend]
      attributes: [
        "savings_product_id", 
        "product_code", 
        ["name", "product_name"],     // Alias dari 'name' ke 'product_name'
        ["akad_type", "akad"]         // Alias dari 'akad_type' ke 'akad'
      ],
      order: [["savings_product_id", "ASC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Data produk simpanan berhasil diambil",
      data: products,
    });
  } catch (error) {
    console.error("Error getSavingsProducts:", error);
    return res.status(500).json({
      status: false,
      message: "Gagal mengambil data produk",
      error: error.message,
    });
  }
};