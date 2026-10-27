import db from "../../models/index.js";
import { Sequelize } from "sequelize";

export const getAdminSavingsReport = async (req, res) => {
  try {
    const members = await db.Member.findAll({
      attributes: ["member_id", "full_name"],
      order: [["full_name", "ASC"]]
    });

    const currentYear = new Date().getFullYear();

    // 1. Ambil data dari tabel savings utama (transaksi / import)
    const directSavings = await db.Savings.findAll({
      attributes: [
        "member_id",
        [Sequelize.fn("YEAR", Sequelize.col("transaction_date")), "yr"],
        "savings_type",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"]
      ],
      where: {
        status: { [Sequelize.Op.in]: ["COMPLETED", "APPROVED"] }
      },
      group: ["member_id", "yr", "savings_type"],
      raw: true
    });

    // 2. Fallback: Ambil data dari MemberSavingsAccount jika ada
    const accounts = await db.MemberSavingsAccount.findAll({
      include: [{ model: db.SavingsProduct, as: "savingsProduct", attributes: ["name"] }]
    });

    // 3. Ambil data historis
    const historical = await db.SavingsReport.findAll({
      where: { year: { [Sequelize.Op.in]: [currentYear - 1, currentYear - 2] } }
    });

    let sum_total_pokok = 0;
    let sum_total_wajib = 0;
    let sum_total_sukarela = 0;
    let sum_total_all = 0;

    const reportData = members.map(member => {
      let ini_pokok = 0, ini_wajib = 0, ini_sukarela = 0, ini_total = 0;
      let lalu_pokok = 0, lalu_wajib = 0, lalu_sukarela = 0, lalu_total = 0;
      let lalu2_pokok = 0, lalu2_wajib = 0, lalu2_sukarela = 0, lalu2_total = 0;

      // Filter dari tabel savings
      const memberSavings = directSavings.filter(s => s.member_id === member.member_id);
      if (memberSavings.length > 0) {
        memberSavings.forEach(s => {
          const yr = parseInt(s.yr, 10);
          const type = (s.savings_type || "").toUpperCase();
          const amount = parseFloat(s.total_amount) || 0;

          if (yr === currentYear || !yr) {
            ini_total += amount;
            if (type === "POKOK") ini_pokok += amount;
            else if (type === "WAJIB") ini_wajib += amount;
            else ini_sukarela += amount;
          } else if (yr === currentYear - 1) {
            lalu_total += amount;
            if (type === "POKOK") lalu_pokok += amount;
            else if (type === "WAJIB") lalu_wajib += amount;
            else lalu_sukarela += amount;
          } else if (yr === currentYear - 2) {
            lalu2_total += amount;
            if (type === "POKOK") lalu2_pokok += amount;
            else if (type === "WAJIB") lalu2_wajib += amount;
            else lalu2_sukarela += amount;
          }
        });
      } else {
        // Fallback ke MemberSavingsAccount
        const memberAccounts = accounts.filter(a => a.member_id === member.member_id);
        memberAccounts.forEach(acc => {
          const type = (acc.savingsProduct?.name || "").toUpperCase();
          const balance = parseFloat(acc.current_balance) || 0;
          ini_total += balance;
          if (type.includes("POKOK")) ini_pokok += balance;
          else if (type.includes("WAJIB")) ini_wajib += balance;
          else ini_sukarela += balance;
        });
      }

      // Gabungkan dengan historical jika tahun lalu/tahun lalu2 belum terisi
      const memberHist = historical.filter(h => h.member_id === member.member_id);
      memberHist.forEach(h => {
        if (h.year === currentYear - 1 && lalu_total === 0) {
          lalu_pokok = parseFloat(h.total_pokok) || 0;
          lalu_wajib = parseFloat(h.total_wajib) || 0;
          lalu_sukarela = parseFloat(h.total_sukarela) || 0;
          lalu_total = parseFloat(h.total_all) || 0;
        } else if (h.year === currentYear - 2 && lalu2_total === 0) {
          lalu2_pokok = parseFloat(h.total_pokok) || 0;
          lalu2_wajib = parseFloat(h.total_wajib) || 0;
          lalu2_sukarela = parseFloat(h.total_sukarela) || 0;
          lalu2_total = parseFloat(h.total_all) || 0;
        }
      });

      sum_total_pokok += ini_pokok;
      sum_total_wajib += ini_wajib;
      sum_total_sukarela += ini_sukarela;
      sum_total_all += ini_total;

      return {
        id: member.member_id,
        nama: member.full_name,
        tahun_ini: { total: ini_total, pokok: ini_pokok, wajib: ini_wajib, sukarela: ini_sukarela },
        tahun_lalu: { total: lalu_total, pokok: lalu_pokok, wajib: lalu_wajib, sukarela: lalu_sukarela },
        tahun_lalu2: { total: lalu2_total, pokok: lalu2_pokok, wajib: lalu2_wajib, sukarela: lalu2_sukarela }
      };
    });

    const summary = {
      total_pokok: sum_total_pokok,
      total_wajib: sum_total_wajib,
      total_sukarela: sum_total_sukarela,
      total_all: sum_total_all
    };

    return res.status(200).json({
      status: true,
      message: "Data laporan simpanan berhasil diambil",
      data: {
        list: reportData,
        summary
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
