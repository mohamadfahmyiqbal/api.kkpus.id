import xlsx from "xlsx";

export const downloadTemplateTabungan = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    // Data header template
    const templateData = [
      {
        "No. Anggota": "A001",
        "Kategori Tabungan": "Pendidikan",
        "Nama Program": "Tabungan Anak Sekolah",
        "Saldo Saat Ini (Rp)": 500000,
        "Target (Rp)": 10000000,
        "Jangka Waktu (Bulan)": 24,
      },
      {
        "No. Anggota": "A002",
        "Kategori Tabungan": "Qurban",
        "Nama Program": "Tabungan Sapi Qurban",
        "Saldo Saat Ini (Rp)": 1000000,
        "Target (Rp)": 21000000,
        "Jangka Waktu (Bulan)": 10,
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
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
      error: error.message
    });
  }
};
