import db from "../../models/index.js";
import { Sequelize } from "sequelize";

export const getAdminSavingsSummary = async (req, res) => {
  try {
    const summaryData = await db.MemberSavingsAccount.findAll({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("current_balance")), "total_balance"],
        [Sequelize.col("savingsProduct.name"), "product_name"]
      ],
      include: [
        {
          model: db.SavingsProduct,
          as: "savingsProduct",
          attributes: [],
          required: true
        }
      ],
      group: ["savingsProduct.name"],
      raw: true
    });

    let totalSemua = 0;
    let totalPokok = 0;
    let totalWajib = 0;
    let totalSukarela = 0;

    summaryData.forEach(item => {
      const amount = parseFloat(item.total_balance) || 0;
      const type = (item.product_name || '').toUpperCase();
      
      totalSemua += amount;

      if (type.includes('POKOK')) {
        totalPokok += amount;
      } else if (type.includes('WAJIB')) {
        totalWajib += amount;
      } else {
        totalSukarela += amount;
      }
    });

    console.log("[AdminSavingsSummary] Aggregated totals:", { totalSemua, totalPokok, totalWajib, totalSukarela });

    return res.status(200).json({
      status: true,
      message: "Ringkasan simpanan berhasil diambil",
      data: {
        total_semua: totalSemua,
        total_pokok: totalPokok,
        total_wajib: totalWajib,
        total_sukarela: totalSukarela
      }
    });

  } catch (error) {
    console.error("Error getAdminSavingsSummary:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};
