import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member, SavingTarget, MemberSavingTarget } = db;

export const importTabungan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return res.status(400).json({ success: false, message: "File Excel kosong" });
    }

    const successData = [];
    const errorData = [];

    // Header Template: No. Anggota, Kategori Tabungan, Nama Program, Saldo Saat Ini (Rp), Target (Rp), Jangka Waktu (Bulan)
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const kategori = row["Kategori Tabungan"] || "Lainnya";
      const namaProgram = row["Nama Program"];
      const saldo = parseFloat(row["Saldo Saat Ini (Rp)"]) || 0;
      const target = parseFloat(row["Target (Rp)"]) || 0;
      const term = parseInt(row["Jangka Waktu (Bulan)"]) || 12;

      if (!memberNo || !namaProgram) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Nama Program) tidak lengkap/valid" });
        continue;
      }

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      // Check if SavingTarget (program) exists
      let program = await SavingTarget.findOne({
        where: { target_name: namaProgram }
      });

      // If not, create a generic program
      if (!program) {
        program = await SavingTarget.create({
          target_name: namaProgram,
          category: kategori,
          description: "Dibuat otomatis dari Import",
          target_amount: target > 0 ? target : 10000000,
          term_months: term,
          min_monthly_deposit: target > 0 ? (target / term) : 100000,
          is_active: true
        });
      }

      try {
        const newTarget = await MemberSavingTarget.create({
          member_id: existingMember.member_id,
          saving_target_id: program.saving_target_id,
          target_amount: target > 0 ? target : program.target_amount,
          monthly_deposit: target > 0 ? (target / term) : program.min_monthly_deposit,
          term_months: term,
          current_balance: saldo,
          start_period_month: new Date().getMonth() + 1,
          start_period_year: new Date().getFullYear(),
          status: "ACTIVE", // Langsung aktif
        });
        successData.push(newTarget);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import Tabungan selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData
      }
    });

  } catch (error) {
    console.error("Import Tabungan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import Tabungan",
      error: error.message
    });
  }
};
