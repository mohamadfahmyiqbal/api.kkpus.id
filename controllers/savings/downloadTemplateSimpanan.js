import xlsx from "xlsx";

export const downloadTemplateSimpanan = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    // Data header template
    const templateData = [
      {
        "No. Anggota": "A001",
        "Jenis Simpanan": "SUKARELA",
        "Nominal": 50000,
        "Tanggal Transaksi": "2024-01-15",
        "Keterangan": "Setoran awal",
      },
      {
        "No. Anggota": "A002",
        "Jenis Simpanan": "WAJIB",
        "Nominal": 20000,
        "Tanggal Transaksi": "2024-01-16",
        "Keterangan": "Iuran bulanan",
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
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
      error: error.message
    });
  }
};
