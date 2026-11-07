import ExcelJS from 'exceljs';
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplateArisan = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template_Import_Arisan");

    // Data contoh statis anonim untuk mencegah kebocoran PII (ISO 27001 A.5.34 / A.8.11 / UU PDP)
    worksheet.columns = [
      { header: "No. Anggota", key: "No_Anggota", width: 15 },
      { header: "Nama Anggota (Referensi)", key: "nama_anggota", width: 25 },
      { header: "Nama Arisan", key: "nama_arisan", width: 25 },
      { header: "Nilai Arisan", key: "nilai_arisan", width: 15 },
      { header: "Biaya Admin (Rp)", key: "biaya_admin", width: 18 },
      { header: "Tenor (Bulan)", key: "tenor", width: 15 },
      { header: "Keterangan", key: "keterangan", width: 30 },
    ];

    worksheet.addRow({
      "No. Anggota": "A001",
      "Nama Anggota (Referensi)": "Contoh Anggota 1",
      "Nama Arisan": "Arisan Sembako",
      "Nilai Arisan": 1000000,
      "Biaya Admin (Rp)": 10000,
      "Tenor (Bulan)": 10,
      "Keterangan": "Arisan bulanan ibu-ibu",
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Template_Import_Arisan.xlsx`
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Arisan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
    });
  }
};
