import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplateTabungan = async (req, res) => {
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
        "Kategori Tabungan": "Umum",
        "Nama Program": "",
        "Saldo Saat Ini (Rp)": 0,
        "Target (Rp)": 0,
        "Jangka Waktu (Bulan)": 12,
      }));
    } else {
      templateData = [
        {
          "No. Anggota": "A001",
          "Nama Anggota (Referensi)": "Contoh Anggota 1",
          "Kategori Tabungan": "Pendidikan",
          "Nama Program": "Tabungan Anak Sekolah",
          "Saldo Saat Ini (Rp)": 500000,
          "Target (Rp)": 10000000,
          "Jangka Waktu (Bulan)": 24,
        },
      ];
    }

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
      { wch: 25 }, // Nama Anggota (Referensi)
      { wch: 20 }, // Kategori Tabungan
      { wch: 30 }, // Nama Program
      { wch: 25 }, // Saldo Saat Ini
      { wch: 20 }, // Target (Rp)
      { wch: 25 }, // Jangka Waktu (Bulan)
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, "Template_Tabungan");

    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_Tabungan.xlsx"
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Tabungan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
      error: error.message,
    });
  }
};
