import db from "../../models/index.js";

const { sequelize } = db;

const getLoanProducts = async (req, res) => {
  try {
    const [products] = await sequelize.query(`
      SELECT 
        loan_product_id as product_id,
        product_name as name,
        loan_type,
        akad_type,
        default_term
      FROM loan_products 
      ORDER BY product_name
    `);

    res.status(200).json({
      success: true,
      data: products,
      message: "Produk pinjaman berhasil diambil",
    });
  } catch (error) {
    console.error("Error getting loan products:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil produk pinjaman",
      error: error.message,
    });
  }
};

export default getLoanProducts;
