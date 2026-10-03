import db from "../../models/index.js";
import { Sequelize } from "sequelize";

export const getAdminSavingsReport = async (req, res) => {
  try {
    const members = await db.Member.findAll({
      attributes: ["member_id", "full_name"],
      order: [["full_name", "ASC"]]
    });

    const accounts = await db.MemberSavingsAccount.findAll({
      include: [{ model: db.SavingsProduct, as: "savingsProduct", attributes: ["name"] }]
    });

    const currentYear = new Date().getFullYear();
    const historical = await db.SavingsReport.findAll({
      where: { year: { [Sequelize.Op.in]: [currentYear - 1, currentYear - 2] } }
    });

    const reportData = members.map(member => {
      let ini_pokok = 0, ini_wajib = 0, ini_sukarela = 0, ini_total = 0;
      let lalu_pokok = 0, lalu_wajib = 0, lalu_sukarela = 0, lalu_total = 0;
      let lalu2_pokok = 0, lalu2_wajib = 0, lalu2_sukarela = 0, lalu2_total = 0;

      const memberAccounts = accounts.filter(a => a.member_id === member.member_id);
      memberAccounts.forEach(acc => {
        const type = (acc.savingsProduct?.name || "").toUpperCase();
        const balance = parseFloat(acc.current_balance) || 0;
        ini_total += balance;
        if (type.includes("POKOK")) ini_pokok += balance;
        else if (type.includes("WAJIB")) ini_wajib += balance;
        else ini_sukarela += balance;
      });

      const memberHist = historical.filter(h => h.member_id === member.member_id);
      memberHist.forEach(h => {
        if (h.year === currentYear - 1) {
          lalu_pokok = parseFloat(h.total_pokok) || 0;
          lalu_wajib = parseFloat(h.total_wajib) || 0;
          lalu_sukarela = parseFloat(h.total_sukarela) || 0;
          lalu_total = parseFloat(h.total_all) || 0;
        } else if (h.year === currentYear - 2) {
          lalu2_pokok = parseFloat(h.total_pokok) || 0;
          lalu2_wajib = parseFloat(h.total_wajib) || 0;
          lalu2_sukarela = parseFloat(h.total_sukarela) || 0;
          lalu2_total = parseFloat(h.total_all) || 0;
        }
      });

      return {
        id: member.member_id,
        nama: member.full_name,
        tahun_ini: { total: ini_total, pokok: ini_pokok, wajib: ini_wajib, sukarela: ini_sukarela },
        tahun_lalu: { total: lalu_total, pokok: lalu_pokok, wajib: lalu_wajib, sukarela: lalu_sukarela },
        tahun_lalu2: { total: lalu2_total, pokok: lalu2_pokok, wajib: lalu2_wajib, sukarela: lalu2_sukarela }
      };
    });

    // Add Aggregated Summary for Neraca & Jurnal
    const summary = await db.MemberSavingsAccount.findAll({
      attributes: [
        [Sequelize.literal("SUM(CASE WHEN name LIKE '%POKOK%' THEN current_balance ELSE 0 END)"), "total_pokok"],
        [Sequelize.literal("SUM(CASE WHEN name LIKE '%WAJIB%' THEN current_balance ELSE 0 END)"), "total_wajib"],
        [Sequelize.literal("SUM(CASE WHEN name NOT LIKE '%POKOK%' AND name NOT LIKE '%WAJIB%' THEN current_balance ELSE 0 END)"), "total_sukarela"],
        [Sequelize.fn("SUM", Sequelize.col("current_balance")), "total_all"]
      ],
      include: [
        {
          model: db.SavingsProduct,
          as: "savingsProduct",
          attributes: []
        }
      ],
      raw: true
    });

    return res.status(200).json({
      status: true,
      message: "Data laporan simpanan berhasil diambil",
      data: {
        list: reportData,
        summary: summary[0] || { total_pokok: 0, total_wajib: 0, total_sukarela: 0, total_all: 0 }
      }
    });

  } catch (error) {
    console.error("Error getAdminSavingsReport:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};
