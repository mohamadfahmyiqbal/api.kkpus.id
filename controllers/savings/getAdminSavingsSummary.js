import db from "../../models/index.js";
import { Sequelize } from "sequelize";

export const getAdminSavingsSummary = async (req, res) => {
  try {
    let totalSemua = 0;
    let totalPokok = 0;
    let totalWajib = 0;
    let totalSukarela = 0;

    // 1. Coba ambil dari tabel savings (tabel utama transaksi simpanan)
    if (db.Savings) {
      const savingsGroup = await db.Savings.findAll({
        attributes: [
          "savings_type",
          [Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"]
        ],
        where: {
          status: "COMPLETED"
        },
        group: ["savings_type"],
        raw: true
      });

      // 1b. Cek jika ada bill_items PAID untuk SW_WAJIB agar nilainya konsisten dengan member aggregates
      let billWajibPaid = 0;
      if (db.BillItem) {
        const biPaid = await db.BillItem.findAll({
          attributes: [[Sequelize.fn("SUM", Sequelize.col("amount")), "total_paid"]],
          where: {
            category_code: "SW_WAJIB",
            status: "PAID"
          },
          raw: true
        });
        billWajibPaid = parseFloat(biPaid[0]?.total_paid) || 0;
      }

      if (savingsGroup && savingsGroup.length > 0) {
        savingsGroup.forEach(item => {
          const amount = parseFloat(item.total_amount) || 0;
          const type = (item.savings_type || "").toUpperCase();

          if (type === "POKOK") {
            totalPokok += amount;
            totalSemua += amount;
          } else if (type === "WAJIB") {
            // Gunakan nilai bill_items PAID jika ada agar konsisten dengan ringkasan anggota
            const effectiveWajib = billWajibPaid > 0 ? billWajibPaid : amount;
            totalWajib += effectiveWajib;
            totalSemua += effectiveWajib;
          } else {
            totalSukarela += amount;
            totalSemua += amount;
          }
        });
      }
    }

    // 2. Jika tabel savings kosong, fallback ke tabel MemberSavingsAccount
    if (totalSemua === 0 && db.MemberSavingsAccount) {
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
    }

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
