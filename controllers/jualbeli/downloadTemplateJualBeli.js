import xlsx from "xlsx";

export const downloadTemplateJualBeli = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    // Data header template
    const templateData = [
      {
        "No. Anggota": "A001",
        "Kategori": "Elektronik",
        "Nama Barang": "Laptop Asus",
        "Harga Barang": 10000000,
        "DP": 2000000,
        "Margin (Rp)": 1500000,
        "Tenor (Bulan)": 12,
        "Keterangan": "Pembelian laptop kredit",
      },
      {
        "No. Anggota": "A002",
        "Kategori": "Kendaraan",
        "Nama Barang": "Motor Honda Vario",
        "Harga Barang": 25000000,
        "DP": 5000000,
        "Margin (Rp)": 3000000,
        "Tenor (Bulan)": 24,
        "Keterangan": "Motor matic",
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
      { wch: 20 }, // Kategori
      { wch: 25 }, // Nama Barang
      { wch: 15 }, // Harga Barang
      { wch: 15 }, // DP
      { wch: 15 }, // Margin (Rp)
      { wch: 15 }, // Tenor (Bulan)
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
      error: error.message
    });
  }
};
