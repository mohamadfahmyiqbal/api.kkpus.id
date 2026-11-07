import { readExcelBuffer } from "../../utils/excelGenerator.js";
import db from "../../models/index.js";

const { Member, FinancingApplication } = db;

export const importArisan = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah" });
    }

    const data = await readExcelBuffer(req.file.buffer);

    if (data.length === 0) {
      return res.status(400).json({ success: false, message: "File Excel kosong" });
    }

    const successData = [];
    const errorData = [];

    // Header Template: No. Anggota, Nama Arisan, Nilai Arisan, Biaya Admin (Rp), Tenor (Bulan), Keterangan
    for (let i = 0; i < data.length; i++) {
      const rawRow = data[i];
      if (!rawRow || typeof rawRow !== "object") continue;

      // Sanitasi input mencegah prototype pollution (CWE-1321 / ISO 27001 A.8.8)
      const row = Object.create(null);
      for (const [key, val] of Object.entries(rawRow)) {
        if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
        row[key] = typeof val === "string" ? val.trim() : val;
      }

      const memberNo = row["No. Anggota"];
      const namaArisan = row["Nama Arisan"];
      const nilaiArisan = parseFloat(row["Nilai Arisan"]) || 0;
      const admin = parseFloat(row["Biaya Admin (Rp)"]) || 0;
      const tenor = parseInt(row["Tenor (Bulan)"]) || 0;
      const keterangan = row["Keterangan"] || "Import Data Pengajuan Arisan";

      // Jika nama arisan kosong atau nilai arisan 0, lewati baris ini (tidak diimpor)
      if (!namaArisan || nilaiArisan <= 0) {
        continue;
      }

      if (!memberNo || tenor <= 0) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Nama Arisan, Nilai, Tenor) tidak lengkap/valid" });
        continue;
      }

      // Pastikan nama arisan berawalan 'Arisan' agar terbaca di dashboard Arisan
      const finalPurpose = namaArisan.toLowerCase().startsWith('arisan') ? namaArisan : `Arisan ${namaArisan}`;

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      const totalTagihan = nilaiArisan + admin;
      const monthlyInstallment = totalTagihan / tenor;

      try {
        const newFinancing = await FinancingApplication.create({
          member_id: existingMember.member_id,
          category: "Arisan",
          purpose: finalPurpose, 
          amount_requested: nilaiArisan,
          margin_amount: admin,
          total_tagihan: totalTagihan,
          cooperation_months: tenor,
          monthly_installment: monthlyInstallment,
          keterangan: keterangan,
          status: "COMPLETED", // Diset COMPLETED agar masuk ke rekap history
          akad_type: "Wadi'ah",
        });
        successData.push(newFinancing);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import Arisan selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData
      }
    });

  } catch (error) {
    console.error("Import Arisan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import Arisan",
    });
  }
};
