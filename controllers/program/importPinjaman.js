import { readExcelBuffer } from "../../utils/excelGenerator.js";
import db from "../../models/index.js";

const { Member, FinancingApplication } = db;

const parseDateValue = (val) => {
  if (!val) return new Date();
  if (val instanceof Date && !isNaN(val.getTime())) {
    return val;
  }
  if (typeof val === "number") {
    // Excel base date: 1899-12-30
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    return new Date(excelEpoch.getTime() + val * 86400000);
  }
  const parsed = new Date(val);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }
  return new Date();
};

export const importPinjaman = async (req, res) => {
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

    // Header Template: No. Anggota, Kategori, Nama Pinjaman, Jumlah Pinjaman, Uang Muka / DP, Margin/Bunga (Rp), Tenor (Bulan), Tanggal Pengajuan, Status, Metode Pencairan, Bank Tujuan, No. Rekening, Keterangan
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
      const kategori = row["Kategori"] || "Pinjaman Tunai";
      const namaPinjaman = row["Nama Pinjaman"];
      const jumlahPinjaman = parseFloat(row["Jumlah Pinjaman"]) || 0;
      const dp = parseFloat(row["Uang Muka / DP"] || row["DP"] || row["Uang Muka"]) || 0;
      const margin = parseFloat(row["Margin/Bunga (Rp)"] || row["Margin (Rp)"] || row["Margin"]) || 0;
      const tenor = parseInt(row["Tenor (Bulan)"] || row["Tenor"]) || 0;
      const rawTanggal = row["Tanggal Pengajuan (YYYY-MM-DD)"] || row["Tanggal Pengajuan"] || row["Tanggal Akad"] || row["Tanggal"];
      
      let statusInput = (row["Status"] || "APPROVED").toString().trim().toUpperCase();
      if (!["APPROVED", "COMPLETED", "PENDING"].includes(statusInput)) {
        statusInput = "APPROVED";
      }

      const metodePencairan = row["Metode Pencairan"] || row["Metode"] || "Tunai";
      const bankTujuan = row["Bank Tujuan"] || row["Bank"] || null;
      const noRekening = row["No. Rekening"] || row["Nomor Rekening"] || row["No Rekening"] || null;
      const keterangan = row["Keterangan"] || "Import Data Pinjaman Lunak";

      // Jika nama pinjaman kosong atau jumlah <= 0, lewati baris ini (header / baris kosong)
      if (!namaPinjaman || jumlahPinjaman <= 0) {
        continue;
      }

      if (!memberNo || tenor <= 0) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Nama Pinjaman, Jumlah, Tenor) tidak lengkap/valid" });
        continue;
      }

      // Pastikan nama pinjaman berawalan 'Pinjaman' agar terbaca di filter/dashboard Pinjaman
      const finalPurpose = namaPinjaman.toLowerCase().startsWith("pinjaman") ? namaPinjaman : `Pinjaman ${namaPinjaman}`;

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      const totalTagihan = Math.max(0, (jumlahPinjaman + margin) - dp);
      const monthlyInstallment = tenor > 0 ? totalTagihan / tenor : 0;
      const applicationDate = parseDateValue(rawTanggal);

      try {
        const newFinancing = await FinancingApplication.create({
          member_id: existingMember.member_id,
          category: kategori,
          purpose: finalPurpose, 
          item_price: jumlahPinjaman,
          down_payment: dp,
          amount_requested: jumlahPinjaman,
          margin_amount: margin,
          total_tagihan: totalTagihan,
          cooperation_months: tenor,
          monthly_installment: monthlyInstallment,
          keterangan: keterangan,
          status: statusInput,
          akad_type: "Qardh", // Pinjaman lunak berakad Qardh
          metode_pencairan: metodePencairan,
          bank_tujuan: bankTujuan,
          no_rekening: noRekening,
          tanggal_pencairan: applicationDate,
          created_at: applicationDate,
          updated_at: applicationDate,
        });
        successData.push(newFinancing);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import Data Pinjaman selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData
      }
    });

  } catch (error) {
    console.error("Import Pinjaman Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import Pinjaman",
    });
  }
};
