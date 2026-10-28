import ExcelJS from "exceljs";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplateJualBeli = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template_Import_JualBeli");

    // Header Kolom
    worksheet.columns = [
      { header: "No. Anggota", key: "member_no", width: 16 },
      { header: "Nama Anggota (Referensi)", key: "member_name", width: 28 },
      { header: "Type / Kategori", key: "category", width: 20 },
      { header: "Nama Barang", key: "item_name", width: 26 },
      { header: "Harga Barang", key: "item_price", width: 16 },
      { header: "DP", key: "dp", width: 16 },
      { header: "Margin (Rp)", key: "margin", width: 16 },
      { header: "Tenor (Bulan)", key: "tenor", width: 16 },
      { header: "Status", key: "status", width: 18 },
      { header: "Keterangan", key: "keterangan", width: 32 },
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

    if (members && members.length > 0) {
      members.forEach((m) => {
        worksheet.addRow({
          member_no: m.member_no,
          member_name: m.full_name,
          category: "Elektronik",
          item_name: "",
          item_price: 0,
          dp: 0,
          margin: 0,
          tenor: 12,
          status: "APPROVED",
          keterangan: "",
        });
      });
    } else {
      worksheet.addRow({
        member_no: "A001",
        member_name: "Contoh Anggota 1",
        category: "Elektronik",
        item_name: "Laptop Asus",
        item_price: 10000000,
        dp: 2000000,
        margin: 1500000,
        tenor: 12,
        status: "APPROVED",
        keterangan: "Pembelian laptop kredit",
      });
    }

    // Pasang Dropdown Data Validation pada kolom Status (Kolom I / Kolom 9)
    const rowCount = Math.max(members.length + 10, 100);
    const statusValidationFormula = `"${["APPROVED", "PENDING", "COMPLETED"].join(",")}"`;

    for (let r = 2; r <= rowCount; r++) {
      worksheet.getCell(`I${r}`).dataValidation = {
        type: "list",
        allowBlank: false,
        formulae: [statusValidationFormula],
        showErrorMessage: true,
        errorStyle: "stop",
        errorTitle: "Status Tidak Valid",
        error: "Pilih salah satu status dari pilihan yang tersedia: APPROVED, PENDING, atau COMPLETED.",
        showInputMessage: true,
        promptTitle: "Pilih Status",
        prompt: "APPROVED = Sedang Berjalan\nPENDING = Menunggu Approval\nCOMPLETED = Lunas",
      };
    }

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_JualBeli.xlsx"
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Jual Beli Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
      error: error.message,
    });
  }
};
