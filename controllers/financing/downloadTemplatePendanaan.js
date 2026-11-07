import ExcelJS from "exceljs";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplatePendanaan = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template_Pendanaan");

    worksheet.columns = [
      { header: "No. Anggota", key: "member_no", width: 15 },
      { header: "Nama Anggota (Referensi)", key: "full_name", width: 25 },
      { header: "Nama Pendanaan", key: "nama_pendanaan", width: 30 },
      { header: "Jumlah Pendanaan (Rp)", key: "jumlah_pendanaan", width: 25 },
      { header: "Margin/Bagi Hasil (Rp)", key: "margin", width: 25 },
      { header: "Tenor (Bulan)", key: "tenor", width: 15 },
      { header: "Keterangan", key: "keterangan", width: 30 },
    ];

    const members = await Member.findAll({
      attributes: ["member_no", "full_name"],
      order: [["member_no", "ASC"]],
    });

    if (members && members.length > 0) {
      members.forEach((m) => {
        worksheet.addRow({
          member_no: m.member_no,
          full_name: m.full_name,
          nama_pendanaan: "",
          jumlah_pendanaan: 0,
          margin: 0,
          tenor: 12,
          keterangan: "",
        });
      });
    } else {
      worksheet.addRow({
        member_no: "A001",
        full_name: "Contoh Anggota 1",
        nama_pendanaan: "Modal Usaha Warung Tegal",
        jumlah_pendanaan: 15000000,
        margin: 1500000,
        tenor: 12,
        keterangan: "Pendanaan UMKM",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_Pendanaan.xlsx"
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Pendanaan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
      error: error.message,
    });
  }
};
