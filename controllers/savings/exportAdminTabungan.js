import db from "../../models/index.js";
import { generateExcelBuffer } from "../../utils/excelGenerator.js";

export const exportAdminTabungan = async (req, res) => {
  try {
    const tabunganData = await db.MemberSavingTarget.findAll({
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["member_id", "full_name"]
        },
        {
          model: db.SavingTarget,
          as: "savingTarget",
          attributes: ["saving_target_id", "target_name", "category", "target_amount", "term_months", "min_monthly_deposit"]
        }
      ],
      order: [["created_at", "DESC"]]
    });

    const flatData = tabunganData.map((item, index) => {
      const term = item.savingTarget?.term_months || item.term_months || 0;
      const setoran = item.savingTarget?.min_monthly_deposit || item.monthly_deposit || 0;
      const target = item.savingTarget?.target_amount || item.target_amount || 0;
      const saldo = parseFloat(item.current_balance) || 0;
      const kekurangan = Math.max(0, target - saldo);

      return {
        "No": index + 1,
        "No Transaksi": `TRX-${item.member_saving_target_id}`,
        "Bulan Pencairan": "-", // Or calculate it if needed
        "Nama": item.member?.full_name || "Unknown",
        "Kategori": item.savingTarget?.category || item.category || "Lainnya",
        "Termin": `${term} Bulan`,
        "Value Per Bulan": setoran,
        "Target": target,
        "Aktual (Saldo)": saldo,
        "Kekurangan": kekurangan,
        "Status": item.status || "PENDING"
      };
    });

    const buffer = generateExcelBuffer(flatData, "Report Tabungan");
    
    res.setHeader('Content-Disposition', 'attachment; filename="Report_Tabungan.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error exportAdminTabungan:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};
