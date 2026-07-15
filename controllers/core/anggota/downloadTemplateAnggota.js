import xlsx from "xlsx";

export const downloadTemplateAnggota = async (req, res) => {
  try {
    const data = [
      {
        "No. Anggota": "A001",
        "Nama Lengkap": "John Doe",
        "Email": "john@example.com",
        "No. HP": "081234567890",
        "NIK KTP": "3201010101010001",
        "Jenis Anggota": "Reguler",
        "Jenis Kelamin": "Laki-laki",
        "Alamat": "Jl. Merdeka No. 1",
      },
      {
        "No. Anggota": "A002",
        "Nama Lengkap": "Jane Doe",
        "Email": "jane@example.com",
        "No. HP": "081298765432",
        "NIK KTP": "3201010101010002",
        "Jenis Anggota": "Luar Biasa",
        "Jenis Kelamin": "Perempuan",
        "Alamat": "Jl. Sudirman No. 2",
      },
    ];

    const ws = xlsx.utils.json_to_sheet(data);
    
    // Auto-size columns
    const wscols = [
      { wch: 15 }, // No. Anggota
      { wch: 25 }, // Nama Lengkap
      { wch: 25 }, // Email
      { wch: 15 }, // No. HP
      { wch: 20 }, // NIK KTP
      { wch: 15 }, // Jenis Anggota
      { wch: 15 }, // Jenis Kelamin
      { wch: 30 }, // Alamat
    ];
    ws["!cols"] = wscols;

    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Template Anggota");

    const buffer = xlsx.write(wb, { type: "buffer", bookType: "xlsx" });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_Anggota.xlsx"
    );

    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error generating template:", error);
    res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
      error: error.message,
    });
  }
};
