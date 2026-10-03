import xlsx from "xlsx";

export const downloadTemplateAnggota = async (req, res) => {
  try {
    const data = [
      {
        "No. Anggota": "A001",
        "Nama Lengkap": "John Doe",
        "Email": "john@example.com",
        "Password": "Password123!",
        "No. HP": "081234567890",
        "NIK KTP": "3201010101010001",
        "Jenis Anggota": "Reguler",
        "Jenis Kelamin": "Laki-laki",
        "Tanggal Lahir (YYYY-MM-DD)": "1990-01-01",
        "Tanggal Bergabung (YYYY-MM-DD)": "2023-01-01",
        "RT": "001",
        "RW": "002",
        "Provinsi": "Jawa Barat",
        "Kabupaten/Kota": "Bandung",
        "Kecamatan": "Sumur Bandung",
        "Kelurahan": "Braga",
        "Alamat": "Jl. Merdeka No. 1",
        "Pekerjaan": "Pegawai Swasta",
        "Nama Tempat Bekerja": "PT. Angin ribut",
        "Alamat Tempat Bekerja": "Jl. Industri",
        "Nama Usaha": "Warung Makan John",
        "Alamat Usaha": "Depan Stasiun",
        "Omzet Per Bulan (Rp)": 5000000,
        "Nama Kontak Darurat": "Jane Doe",
        "No HP Kontak Darurat": "0811111111",
        "Hubungan": "Istri",
        "Nama Bank": "BCA",
        "Nomor Rekening": "123456789",
        "Nama Pemilik Rekening": "John Doe"
      }
    ];

    const ws = xlsx.utils.json_to_sheet(data);
    
    // Auto-size columns
    const wscols = [
      { wch: 15 }, // No. Anggota
      { wch: 25 }, // Nama Lengkap
      { wch: 25 }, // Email
      { wch: 20 }, // Password
      { wch: 15 }, // No. HP
      { wch: 20 }, // NIK KTP
      { wch: 15 }, // Jenis Anggota
      { wch: 15 }, // Jenis Kelamin
      { wch: 25 }, // Tanggal Lahir
      { wch: 25 }, // Tanggal Bergabung
      { wch: 10 }, // RT
      { wch: 10 }, // RW
      { wch: 20 }, // Provinsi
      { wch: 20 }, // Kabupaten/Kota
      { wch: 20 }, // Kecamatan
      { wch: 20 }, // Kelurahan
      { wch: 30 }, // Alamat
      { wch: 20 }, // Pekerjaan
      { wch: 25 }, // Nama Tempat Bekerja
      { wch: 30 }, // Alamat Tempat Bekerja
      { wch: 25 }, // Nama Usaha
      { wch: 30 }, // Alamat Usaha
      { wch: 25 }, // Omzet
      { wch: 25 }, // Nama Kontak Darurat
      { wch: 20 }, // No HP Darurat
      { wch: 15 }, // Hubungan
      { wch: 20 }, // Nama Bank
      { wch: 20 }, // Nomor Rekening
      { wch: 25 }, // Nama Pemilik Rekening
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
