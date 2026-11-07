import ExcelJS from "exceljs";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplateSimpanan = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template_Import_Simpanan");

    worksheet.columns = [
      { header: "No. Anggota", key: "no_anggota", width: 15 },
      { header: "Nama Anggota (Referensi)", key: "nama_anggota", width: 25 },
      { header: "Jenis Simpanan", key: "jenis_simpanan", width: 15 },
      { header: "Nominal", key: "nominal", width: 15 },
      { header: "Tanggal Transaksi", key: "tanggal_transaksi", width: 20 },
      { header: "Keterangan", key: "keterangan", width: 30 }
    ];

    const members = await Member.findAll({
      attributes: ["member_no", "full_name"],
      order: [["member_no", "ASC"]],
    });

    if (members && members.length > 0) {
      members.forEach((m) => {
        worksheet.addRow({
          no_anggota: m.member_no,
          nama_anggota: m.full_name,
          jenis_simpanan: "SUKARELA",
          nominal: 0,
          tanggal_transaksi: new Date().toISOString().split("T")[0],
          keterangan: "",
        });
      });
    } else {
      worksheet.addRow({
        no_anggota: "A001",
        nama_anggota: "Contoh Anggota 1",
        jenis_simpanan: "SUKARELA",
        nominal: 50000,
        tanggal_transaksi: "2024-01-15",
        keterangan: "Setoran awal",
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_Simpanan.xlsx"
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Simpanan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
      error: error.message,
    });
  }
};
