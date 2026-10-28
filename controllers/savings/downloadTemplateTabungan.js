import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member, SavingTarget, MemberSavingTarget } = db;

export const downloadTemplateTabungan = async (req, res) => {
  try {
    const { type } = req.query; // 'master' atau 'transaksi'
    const workbook = xlsx.utils.book_new();

    // Ambil daftar anggota aktif dari database
    const members = await Member.findAll({
      attributes: ["member_no", "full_name"],
      order: [["member_no", "ASC"]],
    });

    if (type === "transaksi") {
      // Ambil juga data tabungan anggota yang sudah terdaftar sebagai referensi
      const registeredTargets = await MemberSavingTarget.findAll({
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["member_no", "full_name"],
          },
          {
            model: SavingTarget,
            as: "savingTarget",
            attributes: ["target_name", "category"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      let templateData = [];
      if (registeredTargets && registeredTargets.length > 0) {
        templateData = registeredTargets.map((item) => ({
          "No. Anggota": item.member?.member_no || "",
          "Nama Anggota (Referensi)": item.member?.full_name || "",
          "Nama Program": item.savingTarget?.target_name || "Tabungan Umum",
          "Nominal": item.savingTarget?.min_monthly_deposit || item.monthly_deposit || 100000,
          "Tanggal Transaksi (YYYY-MM-DD)": new Date().toISOString().split("T")[0],
          "Keterangan": `Setoran Tabungan ${item.savingTarget?.target_name || ""}`.trim(),
          "Status (PAID/UNPAID)": "PAID",
        }));
      } else {
        templateData = [
          {
            "No. Anggota": members?.[0]?.member_no || "A001",
            "Nama Anggota (Referensi)": members?.[0]?.full_name || "Nama Anggota",
            "Nama Program": "Tabungan Pendidikan",
            "Nominal": 200000,
            "Tanggal Transaksi (YYYY-MM-DD)": new Date().toISOString().split("T")[0],
            "Keterangan": "Setoran Tabungan Bulan Ini",
            "Status (PAID/UNPAID)": "PAID",
          },
        ];
      }

      const worksheet = xlsx.utils.json_to_sheet(templateData);
      worksheet["!cols"] = [
        { wch: 15 }, // No. Anggota
        { wch: 25 }, // Nama Anggota
        { wch: 28 }, // Nama Program
        { wch: 18 }, // Nominal
        { wch: 25 }, // Tanggal Transaksi
        { wch: 35 }, // Keterangan
        { wch: 22 }, // Status
      ];

      xlsx.utils.book_append_sheet(workbook, worksheet, "Template_Transaksi_Tabungan");

      const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Template_Import_Transaksi_Tabungan.xlsx"
      );
      return res.send(buffer);
    }

    // Default: Master Tabungan
    let templateData = [];
    if (members && members.length > 0) {
      templateData = members.map((m) => ({
        "No. Anggota": m.member_no,
        "Nama Anggota (Referensi)": m.full_name,
        "Kategori Tabungan": "Umum",
        "Nama Program": "",
        "Saldo Saat Ini (Rp)": 0,
        "Target (Rp)": 0,
        "Jangka Waktu (Bulan)": 12,
      }));
    } else {
      templateData = [
        {
          "No. Anggota": "A001",
          "Nama Anggota (Referensi)": "Contoh Anggota 1",
          "Kategori Tabungan": "Pendidikan",
          "Nama Program": "Tabungan Anak Sekolah",
          "Saldo Saat Ini (Rp)": 500000,
          "Target (Rp)": 10000000,
          "Jangka Waktu (Bulan)": 24,
        },
      ];
    }

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    worksheet["!cols"] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 30 },
      { wch: 25 },
      { wch: 20 },
      { wch: 25 },
    ];

    xlsx.utils.book_append_sheet(workbook, worksheet, "Template_Master_Tabungan");

    const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Template_Import_Master_Tabungan.xlsx"
    );
    return res.send(buffer);
  } catch (error) {
    console.error("Download Template Tabungan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
      error: error.message,
    });
  }
};
