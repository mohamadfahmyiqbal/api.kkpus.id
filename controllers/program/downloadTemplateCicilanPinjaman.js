import ExcelJS from "exceljs";
import db from "../../models/index.js";

const { Member, FinancingApplication } = db;

export const downloadTemplateCicilanPinjaman = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template_Import_Cicilan_Pinjaman");

    // Header Kolom
    worksheet.columns = [
      { header: "No. Anggota", key: "member_no", width: 16 },
      { header: "Nama Anggota (Referensi)", key: "member_name", width: 28 },
      { header: "Nama Pinjaman", key: "loan_name", width: 28 },
      { header: "Cicilan Ke", key: "installment_number", width: 14 },
      { header: "Nominal Bayar", key: "amount", width: 18 },
      { header: "Tanggal Pembayaran (YYYY-MM-DD)", key: "payment_date", width: 24 },
      { header: "Status", key: "status", width: 16 },
      { header: "Keterangan / Catatan", key: "description", width: 32 },
    ];

    // Format header style
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // Ambil data pinjaman aktif/ada untuk dijadikan referensi
    const existingLoans = await FinancingApplication.findAll({
      where: {
        purpose: {
          [db.Sequelize.Op.like]: "Pinjaman%",
        },
      },
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["member_no", "full_name"],
        },
      ],
      limit: 50,
      order: [["created_at", "DESC"]],
    });

    const todayStr = new Date().toISOString().split("T")[0];

    if (existingLoans && existingLoans.length > 0) {
      existingLoans.forEach((loan) => {
        worksheet.addRow({
          member_no: loan.member?.member_no || "",
          member_name: loan.member?.full_name || "",
          loan_name: loan.purpose || "Pinjaman Lunak",
          installment_number: 1,
          amount: parseFloat(loan.monthly_installment || 0),
          payment_date: todayStr,
          status: "PAID",
          description: `Pembayaran cicilan ${loan.purpose || "pinjaman"}`,
        });
      });
    } else {
      worksheet.addRow({
        member_no: "A001",
        member_name: "Contoh Anggota 1",
        loan_name: "Pinjaman Lunak",
        installment_number: 1,
        amount: 500000,
        payment_date: todayStr,
        status: "PAID",
        description: "Setoran cicilan pinjaman ke-1",
      });
    }

    // Pasang Dropdown Data Validation pada kolom Status (Kolom G / Kolom 7)
    const rowCount = Math.max((existingLoans?.length || 0) + 10, 100);
    const statusValidationFormula = `"${["PAID", "UNPAID"].join(",")}"`;

    for (let r = 2; r <= rowCount; r++) {
      worksheet.getCell(`G${r}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: [statusValidationFormula],
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Status Tidak Valid",
        error: "Pilih status pembayaran: PAID atau UNPAID.",
        showInputMessage: true,
        promptTitle: "Pilih Status",
        prompt: "PAID = Sudah Dibayar / Diterima\nUNPAID = Tagihan Belum Dibayar",
      };
    }

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_Cicilan_Pinjaman.xlsx"
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Cicilan Pinjaman Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel transaksi cicilan pinjaman.",
      error: error.message,
    });
  }
};
