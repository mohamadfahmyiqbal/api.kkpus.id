import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplateInvestasi = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    // Ambil daftar anggota aktif dari database
    const members = await Member.findAll({
      attributes: ["member_no", "full_name"],
      order: [["member_no", "ASC"]],
    });

    let templateData = [];

    if (members && members.length > 0) {
      templateData = members.map((m) => ({
        "No. Anggota": m.member_no,
        "Nama Anggota (Referensi)": m.full_name,
        "Nama Produk Investasi": "",
        "Nilai Investasi (Rp)": 0,
        "Durasi (Bulan)": 12,
        "Proyeksi Bagi Hasil (%)": 10,
        "Keterangan": "",
      }));
    } else {
      templateData = [
        {
          "No. Anggota": "A001",
          "Nama Anggota (Referensi)": "Contoh Anggota 1",
          "Nama Produk Investasi": "Sukuk Ritel 001",
          "Nilai Investasi (Rp)": 10000000,
          "Durasi (Bulan)": 12,
          "Proyeksi Bagi Hasil (%)": 10,
          "Keterangan": "Investasi jangka pendek",
        },
      ];
    }

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
      { wch: 25 }, // Nama Anggota (Referensi)
      { wch: 30 }, // Nama Produk Investasi
      { wch: 25 }, // Nilai Investasi (Rp)
      { wch: 18 }, // Durasi (Bulan)
      { wch: 25 }, // Proyeksi Bagi Hasil (%)
      { wch: 30 }, // Keterangan
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, "Template_Investasi");

    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_Investasi.xlsx"
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Investasi Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
      error: error.message,
    });
  }
};
