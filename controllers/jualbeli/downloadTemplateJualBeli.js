import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplateJualBeli = async (req, res) => {
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
        "Type / Kategori": "Elektronik",
        "Nama Barang": "",
        "Harga Barang": 0,
        "DP": 0,
        "Margin (Rp)": 0,
        "Tenor (Bulan)": 12,
        "Status": "APPROVED", // Pilihan: APPROVED (Berjalan), PENDING (Menunggu Persetujuan), atau COMPLETED (Lunas)
        "Keterangan": "",
      }));
    } else {
      templateData = [
        {
          "No. Anggota": "A001",
          "Nama Anggota (Referensi)": "Contoh Anggota 1",
          "Type / Kategori": "Elektronik",
          "Nama Barang": "Laptop Asus",
          "Harga Barang": 10000000,
          "DP": 2000000,
          "Margin (Rp)": 1500000,
          "Tenor (Bulan)": 12,
          "Status": "APPROVED",
          "Keterangan": "Pembelian laptop kredit",
        },
      ];
    }

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
      { wch: 25 }, // Nama Anggota (Referensi)
      { wch: 20 }, // Type / Kategori
      { wch: 25 }, // Nama Barang
      { wch: 15 }, // Harga Barang
      { wch: 15 }, // DP
      { wch: 15 }, // Margin (Rp)
      { wch: 15 }, // Tenor (Bulan)
      { wch: 15 }, // Status
      { wch: 30 }, // Keterangan
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, "Template_Import_JualBeli");

    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

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
