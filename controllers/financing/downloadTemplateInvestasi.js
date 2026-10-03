import xlsx from "xlsx";

export const downloadTemplateInvestasi = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    // Data header template
    const templateData = [
      {
        "No. Anggota": "A001",
        "Nama Produk Investasi": "Sukuk Ritel 001",
        "Nilai Investasi (Rp)": 10000000,
        "Durasi (Bulan)": 12,
        "Proyeksi Bagi Hasil (%)": 10,
        "Keterangan": "Investasi jangka pendek",
      },
      {
        "No. Anggota": "A002",
        "Nama Produk Investasi": "Sukuk Dana Pendidikan",
        "Nilai Investasi (Rp)": 20000000,
        "Durasi (Bulan)": 24,
        "Proyeksi Bagi Hasil (%)": 12.5,
        "Keterangan": "Investasi jangka menengah",
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
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
      error: error.message
    });
  }
};
