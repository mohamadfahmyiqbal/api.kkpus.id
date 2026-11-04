import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member } = db;

export const downloadTemplateArisan = async (req, res) => {
  try {
    const workbook = xlsx.utils.book_new();

    // Data contoh statis anonim untuk mencegah kebocoran PII (ISO 27001 A.5.34 / A.8.11 / UU PDP)
    const templateData = [
      {
        "No. Anggota": "A001",
        "Nama Anggota (Referensi)": "Contoh Anggota 1",
        "Nama Arisan": "Arisan Sembako",
        "Nilai Arisan": 1000000,
        "Biaya Admin (Rp)": 10000,
        "Tenor (Bulan)": 10,
        "Keterangan": "Arisan bulanan ibu-ibu",
      },
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);

    // Set lebar kolom
    worksheet["!cols"] = [
      { wch: 15 }, // No. Anggota
      { wch: 25 }, // Nama Anggota (Referensi)
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
    });
  }
};
