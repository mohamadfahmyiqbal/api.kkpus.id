import xlsx from "xlsx";

export const downloadTemplatePinjaman = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    // Data header template
    const templateData = [
      {
        "No. Anggota": "A001",
        "Kategori": "Pinjaman Tunai",
        "Nama Pinjaman": "Pinjaman Pendidikan",
        "Jumlah Pinjaman": 5000000,
        "Margin/Bunga (Rp)": 500000,
        "Tenor (Bulan)": 10,
        "Keterangan": "Untuk biaya sekolah",
      },
      {
        "No. Anggota": "A002",
        "Kategori": "Pinjaman Tunai",
        "Nama Pinjaman": "Pinjaman Kesehatan",
        "Jumlah Pinjaman": 2000000,
        "Margin/Bunga (Rp)": 0,
        "Tenor (Bulan)": 5,
        "Keterangan": "Pinjaman mendesak RS",
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
      { wch: 20 }, // Kategori
      { wch: 25 }, // Nama Pinjaman
      { wch: 15 }, // Jumlah Pinjaman
      { wch: 18 }, // Margin/Bunga
      { wch: 15 }, // Tenor (Bulan)
      { wch: 30 }, // Keterangan
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, "Template_Import_Pinjaman");

    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

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
      message: "Gagal membuat template Excel.",
      error: error.message
    });
  }
};
