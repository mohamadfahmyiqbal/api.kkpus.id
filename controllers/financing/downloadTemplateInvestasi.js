import ExcelJS from "exceljs";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplateInvestasi = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template_Import_Investasi");

    worksheet.columns = [
      { header: "No. Anggota", key: "member_no", width: 15 },
      { header: "Nama Anggota (Referensi)", key: "full_name", width: 25 },
      { header: "Nama Produk Investasi", key: "nama_produk", width: 30 },
      { header: "Nilai Investasi (Rp)", key: "nilai_investasi", width: 25 },
      { header: "Durasi (Bulan)", key: "durasi", width: 15 },
      { header: "Proyeksi Bagi Hasil (%)", key: "profit_rate", width: 25 },
      { header: "Keterangan", key: "keterangan", width: 30 },
    ];

    worksheet.addRow({
      member_no: "A001",
      full_name: "Contoh Anggota 1",
      nama_produk: "Reksa Dana Pasar Uang Syariah",
      nilai_investasi: 5000000,
      durasi: 12,
      profit_rate: 8,
      keterangan: "Investasi Halal Umum",
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Template_Import_Investasi.xlsx`
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Investasi Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
    });
  }
};
