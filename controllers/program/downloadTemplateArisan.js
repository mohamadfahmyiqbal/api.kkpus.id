import xlsx from "xlsx";

export const downloadTemplateArisan = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    // Data header template
    const templateData = [
      {
        "No. Anggota": "A001",
        "Nama Arisan": "Arisan Sembako",
        "Nilai Arisan": 1000000,
        "Biaya Admin (Rp)": 10000,
        "Tenor (Bulan)": 10,
        "Keterangan": "Arisan bulanan ibu-ibu",
      },
      {
        "No. Anggota": "A002",
        "Nama Arisan": "Arisan Motor",
        "Nilai Arisan": 15000000,
        "Biaya Admin (Rp)": 50000,
        "Tenor (Bulan)": 20,
        "Keterangan": "Arisan motor matic",
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
      { wch: 25 }, // Nama Arisan
      { wch: 15 }, // Nilai Arisan
      { wch: 18 }, // Biaya Admin
      { wch: 15 }, // Tenor (Bulan)
      { wch: 30 }, // Keterangan
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, "Template_Import_Arisan");

    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_Arisan.xlsx"
    );

    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Arisan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
      error: error.message
    });
  }
};
