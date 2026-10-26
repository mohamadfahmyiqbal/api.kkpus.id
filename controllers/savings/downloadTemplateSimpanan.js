import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplateSimpanan = async (req, res) => {
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
        "Jenis Simpanan": "SUKARELA",
        "Nominal": 0,
        "Tanggal Transaksi": new Date().toISOString().split("T")[0],
        "Keterangan": "",
      }));
    } else {
      templateData = [
        {
          "No. Anggota": "A001",
          "Nama Anggota (Referensi)": "Contoh Anggota 1",
          "Jenis Simpanan": "SUKARELA",
          "Nominal": 50000,
          "Tanggal Transaksi": "2024-01-15",
          "Keterangan": "Setoran awal",
        },
      ];
    }

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
      { wch: 25 }, // Nama Anggota (Referensi)
      { wch: 15 }, // Jenis Simpanan
      { wch: 15 }, // Nominal
      { wch: 20 }, // Tanggal Transaksi
      { wch: 30 }, // Keterangan
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, "Template_Import_Simpanan");

    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

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
