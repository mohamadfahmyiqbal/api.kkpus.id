import db from "../../models/index.js";
import { Sequelize } from "sequelize";
import { generateExcelBuffer } from "../../utils/excelGenerator.js";

export const exportAdminSavings = async (req, res) => {
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

    const flatData = members.map((member, index) => {
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
        "No": index + 1,
        "ID Anggota": member.member_id,
        "Nama": member.full_name,
        "Total Saldo (Tahun Ini)": ini_total,
        "Pokok (Tahun Ini)": ini_pokok,
        "Wajib (Tahun Ini)": ini_wajib,
        "Sukarela (Tahun Ini)": ini_sukarela,
        "Total Saldo (Tahun Lalu)": lalu_total,
        "Pokok (Tahun Lalu)": lalu_pokok,
        "Wajib (Tahun Lalu)": lalu_wajib,
        "Sukarela (Tahun Lalu)": lalu_sukarela,
        "Total Saldo (2 Tahun Lalu)": lalu2_total,
        "Pokok (2 Tahun Lalu)": lalu2_pokok,
        "Wajib (2 Tahun Lalu)": lalu2_wajib,
        "Sukarela (2 Tahun Lalu)": lalu2_sukarela,
      };
    });

    const buffer = generateExcelBuffer(flatData, "Report Simpanan");
    
    res.setHeader('Content-Disposition', 'attachment; filename="Report_Simpanan.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error exportAdminSavings:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};
