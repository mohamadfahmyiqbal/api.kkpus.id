import db from "../../models/index.js";

const getLoanProducts = async (req, res) => {
  try {
    const products = await db.LoanProduct.findAll({
      attributes: [
        ["loan_product_id", "product_id"],
        ["product_name", "name"],
        "loan_type",
        "akad_type",
        "default_term",
      ],
      order: [["product_name", "ASC"]],
      raw: true,
    });

    return res.status(200).json({
      success: true,
      data: products,
      message: "Produk pinjaman berhasil diambil",
    });
  } catch (error) {
    console.error("Error getting loan products:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengambil produk pinjaman",
      error: error.message,
    });
  }
};

export default getLoanProducts;
