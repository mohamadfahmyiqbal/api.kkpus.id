import ExcelJS from "exceljs";
import db from "../../models/index.js";

const { Member, SavingTarget, MemberSavingTarget } = db;

export const downloadTemplateTabungan = async (req, res) => {
  try {
    const { type } = req.query; // 'master' atau 'transaksi'
    const workbook = new ExcelJS.Workbook();
    const sheetName = type === "transaksi" ? "Template_Transaksi_Tabungan" : "Template_Master_Tabungan";
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = [
      { header: "No. Anggota", key: "no_anggota", width: 15 },
      { header: "Nama Anggota (Referensi)", key: "nama_anggota", width: 25 },
      { header: "Nama Program", key: "nama_program", width: 28 },
      { header: "Nominal", key: "nominal", width: 18 },
      { header: "Tanggal Transaksi (YYYY-MM-DD)", key: "tanggal_transaksi", width: 25 },
      { header: "Keterangan", key: "keterangan", width: 35 },
      { header: "Status (PAID/UNPAID)", key: "status", width: 22 }
    ];

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

      if (registeredTargets && registeredTargets.length > 0) {
        registeredTargets.forEach((item) => {
          worksheet.addRow({
            no_anggota: item.member?.member_no || "",
            nama_anggota: item.member?.full_name || "",
            nama_program: item.savingTarget?.target_name || "Tabungan Umum",
            nominal: item.savingTarget?.min_monthly_deposit || item.monthly_deposit || 100000,
            tanggal_transaksi: new Date().toISOString().split("T")[0],
            keterangan: `Setoran Tabungan ${item.savingTarget?.target_name || ""}`.trim(),
            status: "PAID",
          });
        });
      } else {
        const members = await Member.findAll({
          attributes: ["member_no", "full_name"],
          order: [["member_no", "ASC"]],
        });

        if (members && members.length > 0) {
          members.forEach((m) => {
            worksheet.addRow({
              no_anggota: m.member_no,
              nama_anggota: m.full_name,
              nama_program: "Tabungan Pendidikan",
              nominal: 200000,
              tanggal_transaksi: new Date().toISOString().split("T")[0],
              keterangan: "Setoran Tabungan Bulan Ini",
              status: "PAID",
            });
          });
        } else {
          worksheet.addRow({
            no_anggota: "A001",
            nama_anggota: "Nama Anggota",
            nama_program: "Tabungan Pendidikan",
            nominal: 200000,
            tanggal_transaksi: new Date().toISOString().split("T")[0],
            keterangan: "Setoran Tabungan Bulan Ini",
            status: "PAID",
          });
        }
      }
    }

    // Default: Master Tabungan
    let masters = [];
    const masterMembers = await Member.findAll({
      attributes: ["member_no", "full_name"],
      order: [["member_no", "ASC"]],
    });

    if (masterMembers && masterMembers.length > 0) {
      masterMembers.forEach((m) => {
        masters.push({
          no_anggota: m.member_no,
          nama_anggota: m.full_name,
          kategori_tabungan: "Umum",
          nama_program: "",
          saldo_saat_ini: 0,
          target: 0,
          jangka_waktu: 12,
        });
      });
    }

    if (!masters || masters.length === 0) {
      masters.push({
        no_anggota: "A001",
        nama_anggota: "Contoh Anggota 1",
        kategori_tabungan: "Pendidikan",
        nama_program: "Tabungan Anak Sekolah",
        saldo_saat_ini: 500000,
        target: 10000000,
        jangka_waktu: 24,
      });
    }

    masters.forEach((item) => {
      worksheet.addRow(item);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      type === "transaksi"
        ? "attachment; filename=Template_Import_Transaksi_Tabungan.xlsx"
        : "attachment; filename=Template_Import_Master_Tabungan.xlsx"
    );

    res.send(buffer);
  } catch (error) {
    console.error("Download Template Tabungan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat template Excel.",
      error: error.message,
    });
  }
};
