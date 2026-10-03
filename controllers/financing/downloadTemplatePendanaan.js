import xlsx from "xlsx";

export const downloadTemplatePendanaan = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    // Data header template
    const templateData = [
      {
        "No. Anggota": "A001",
        "Nama Pendanaan": "Modal Usaha Warung Tegal",
        "Jumlah Pendanaan (Rp)": 15000000,
        "Margin/Bagi Hasil (Rp)": 1500000,
        "Tenor (Bulan)": 12,
        "Keterangan": "Pendanaan UMKM",
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
      { wch: 30 }, // Nama Pendanaan
      { wch: 25 }, // Jumlah Pendanaan (Rp)
      { wch: 25 }, // Margin/Bagi Hasil (Rp)
      { wch: 15 }, // Tenor (Bulan)
      { wch: 30 }, // Keterangan
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, "Template_Pendanaan");

    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

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
      error: error.message
    });
  }
};
