import ExcelJS from "exceljs";

export const downloadTemplateAnggota = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Template Anggota");

    worksheet.columns = [
      { header: "No. Anggota", key: "no_anggota", width: 15 },
      { header: "Nama Lengkap", key: "nama_lengkap", width: 25 },
      { header: "Email", key: "email", width: 25 },
      { header: "Password", key: "password", width: 20 },
      { header: "No. HP", key: "no_hp", width: 15 },
      { header: "NIK KTP", key: "nik_ktp", width: 20 },
      { header: "Jenis Anggota", key: "jenis_anggota", width: 15 },
      { header: "Jenis Kelamin", key: "jenis_kelamin", width: 15 },
      { header: "Tanggal Lahir (YYYY-MM-DD)", key: "tanggal_lahir", width: 25 },
      { header: "Tanggal Bergabung (YYYY-MM-DD)", key: "tanggal_bergabung", width: 25 },
      { header: "RT", key: "rt", width: 10 },
      { header: "RW", key: "rw", width: 10 },
      { header: "Provinsi", key: "provinsi", width: 20 },
      { header: "Kabupaten/Kota", key: "kabupaten_kota", width: 20 },
      { header: "Kecamatan", key: "kecamatan", width: 20 },
      { header: "Kelurahan", key: "kelurahan", width: 20 },
      { header: "Alamat", key: "alamat", width: 30 },
      { header: "Pekerjaan", key: "pekerjaan", width: 20 },
      { header: "Nama Tempat Bekerja", key: "nama_tempat_bekerja", width: 25 },
      { header: "Alamat Tempat Bekerja", key: "alamat_tempat_bekerja", width: 30 },
      { header: "Nama Usaha", key: "nama_usaha", width: 25 },
      { header: "Alamat Usaha", key: "alamat_usaha", width: 30 },
      { header: "Omzet Per Bulan (Rp)", key: "omzet_per_bulan", width: 25 },
      { header: "Nama Kontak Darurat", key: "nama_kontak_darurat", width: 25 },
      { header: "No HP Kontak Darurat", key: "no_hp_kontak_darurat", width: 20 },
      { header: "Hubungan", key: "hubungan", width: 15 },
      { header: "Nama Bank", key: "nama_bank", width: 20 },
      { header: "Nomor Rekening", key: "nomor_rekening", width: 20 },
      { header: "Nama Pemilik Rekening", key: "nama_pemilik_rekening", width: 25 }
    ];

    worksheet.addRow({
      no_anggota: "A001",
      nama_lengkap: "John Doe",
      email: "john@example.com",
      password: "Password123!",
      no_hp: "081234567890",
      nik_ktp: "3201010101010001",
      jenis_anggota: "Reguler",
      jenis_kelamin: "Laki-laki",
      tanggal_lahir: "1990-01-01",
      tanggal_bergabung: "2023-01-01",
      rt: "001",
      rw: "002",
      provinsi: "Jawa Barat",
      kabupaten_kota: "Bandung",
      kecamatan: "Sumur Bandung",
      kelurahan: "Braga",
      alamat: "Jl. Merdeka No. 1",
      pekerjaan: "Pegawai Swasta",
      nama_tempat_bekerja: "PT. Angin ribut",
      alamat_tempat_bekerja: "Jl. Industri",
      nama_usaha: "Warung Makan John",
      alamat_usaha: "Depan Stasiun",
      omzet_per_bulan: 5000000,
      nama_kontak_darurat: "Jane Doe",
      no_hp_kontak_darurat: "0811111111",
      hubungan: "Istri",
      nama_bank: "BCA",
      nomor_rekening: "123456789",
      nama_pemilik_rekening: "John Doe"
    });

    const buffer = await workbook.xlsx.writeBuffer();

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
