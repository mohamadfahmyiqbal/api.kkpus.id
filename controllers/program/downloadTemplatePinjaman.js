import ExcelJS from "exceljs";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplatePinjaman = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template_Import_Pinjaman");

    // Header Kolom
    worksheet.columns = [
      { header: "No. Anggota", key: "member_no", width: 16 },
      { header: "Nama Anggota (Referensi)", key: "member_name", width: 28 },
      { header: "Kategori", key: "category", width: 20 },
      { header: "Nama Pinjaman", key: "loan_name", width: 28 },
      { header: "Jumlah Pinjaman", key: "amount", width: 18 },
      { header: "Uang Muka / DP", key: "dp", width: 16 },
      { header: "Margin/Bunga (Rp)", key: "margin", width: 18 },
      { header: "Tenor (Bulan)", key: "tenor", width: 15 },
      { header: "Tanggal Pengajuan (YYYY-MM-DD)", key: "application_date", width: 26 },
      { header: "Status", key: "status", width: 16 },
      { header: "Metode Pencairan", key: "disbursement_method", width: 18 },
      { header: "Bank Tujuan", key: "bank_name", width: 20 },
      { header: "No. Rekening", key: "account_no", width: 22 },
      { header: "Keterangan", key: "keterangan", width: 30 },
    ];

    // Format header style
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // Ambil daftar anggota aktif dari database
    const members = await Member.findAll({
      attributes: ["member_no", "full_name"],
      order: [["member_no", "ASC"]],
    });

    const todayStr = new Date().toISOString().split("T")[0];

    if (members && members.length > 0) {
      members.forEach((m) => {
        worksheet.addRow({
          member_no: m.member_no,
          member_name: m.full_name,
          category: "Pinjaman Tunai",
          loan_name: "",
          amount: 0,
          dp: 0,
          margin: 0,
          tenor: 10,
          application_date: todayStr,
          status: "APPROVED",
          disbursement_method: "Tunai",
          bank_name: "",
          account_no: "",
          keterangan: "",
        });
      });
    } else {
      worksheet.addRow({
        member_no: "A001",
        member_name: "Contoh Anggota 1",
        category: "Pinjaman Tunai",
        loan_name: "Pinjaman Lunak",
        amount: 5000000,
        dp: 0,
        margin: 500000,
        tenor: 10,
        application_date: todayStr,
        status: "APPROVED",
        disbursement_method: "Tunai",
        bank_name: "",
        account_no: "",
        keterangan: "Contoh pinjaman lunak anggota",
      });
    }

    // Pasang Data Validation pada kolom Status (Kolom J / Kolom 10) & Metode Pencairan (Kolom K / Kolom 11)
    const rowCount = Math.max((members?.length || 0) + 10, 100);
    const statusValidationFormula = `"${["APPROVED", "COMPLETED", "PENDING"].join(",")}"`;
    const disbursementValidationFormula = `"${["Tunai", "Transfer"].join(",")}"`;

    for (let r = 2; r <= rowCount; r++) {
      // Status dropdown
      worksheet.getCell(`J${r}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: [statusValidationFormula],
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Status Tidak Valid",
        error: "Pilih status: APPROVED (Berjalan), COMPLETED (Lunas), atau PENDING.",
        showInputMessage: true,
        promptTitle: "Pilih Status",
        prompt: "APPROVED = Pinjaman aktif/berjalan\nCOMPLETED = Pinjaman sudah lunas\nPENDING = Menunggu persetujuan",
      };

      // Metode Pencairan dropdown
      worksheet.getCell(`K${r}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: [disbursementValidationFormula],
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Metode Tidak Valid",
        error: "Pilih metode pencairan: Tunai atau Transfer.",
      };
    }

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_Pinjaman.xlsx"
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Pinjaman Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel pinjaman.",
      error: error.message,
    });
  }
};
