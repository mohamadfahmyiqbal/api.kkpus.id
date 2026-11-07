import { readExcelBuffer } from "../../utils/excelGenerator.js";
import db from "../../models/index.js";

const { Member, FinancingApplication, sequelize } = db;

const MAX_IMPORT_ROWS = 5000;

export const importJualBeli = async (req, res) => {
  let transaction;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Tidak ada file yang diunggah" });
    }

    const data = await readExcelBuffer(req.file.buffer);

    if (!data.length) {
      return res.status(400).json({ success: false, message: "File Excel kosong" });
    }

    if (data.length > MAX_IMPORT_ROWS) {
      return res.status(400).json({
        success: false,
        message: `Jumlah baris melebihi batas ${MAX_IMPORT_ROWS} baris per file.`,
      });
    }

    const successData = [];
    const errorData = [];

    // Satu file diproses dalam satu transaksi. Baris yang tidak valid tetap
    // dilewati, tetapi kegagalan fatal tidak meninggalkan data setengah jadi.
    transaction = await sequelize.transaction();

    // Header Template mendukung:
    // "No. Anggota", "Type / Kategori" atau "Kategori", "Nama Barang", "Harga Barang", "DP", "Margin (Rp)", "Tenor (Bulan)", "Status", "Keterangan"
    for (let i = 0; i < data.length; i++) {
      const rawRow = data[i];
      if (!rawRow || typeof rawRow !== "object") continue;

      // Sanitasi input mencegah prototype pollution (OWASP A06 / ISO 27001 A.8.8)
      const row = Object.create(null);
      for (const [key, val] of Object.entries(rawRow)) {
        if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
        row[key] = typeof val === "string" ? val.trim() : val;
      }

      const memberNo = row["No. Anggota"];
      const kategori = row["Type / Kategori"] || row["Kategori"] || row["Type"] || "Elektronik";
      const namaBarang = row["Nama Barang"] || row["Barang"];
      const hargaBarang = parseFloat(row["Harga Barang"]) || 0;
      const dp = parseFloat(row["DP"] || row["Uang Muka"]) || 0;
      const margin = parseFloat(row["Margin (Rp)"] || row["Margin"]) || 0;
      const tenor = parseInt(row["Tenor (Bulan)"] || row["Tenor"]) || 0;
      const keterangan = row["Keterangan"] || "Import Data Jual Beli";

      // Status pengajuan: default APPROVED (berjalan), atau bisa PENDING, COMPLETED / LUNAS
      let statusInput = (row["Status"] || "APPROVED").toString().trim().toUpperCase();
      if (statusInput === "LUNAS" || statusInput === "PAID") {
        statusInput = "COMPLETED";
      } else if (!["PENDING", "APPROVED", "COMPLETED", "ACTIVE"].includes(statusInput)) {
        statusInput = "APPROVED";
      }

      if (!namaBarang || hargaBarang <= 0) {
        errorData.push({
          row: i + 2,
          reason: "Nama Barang dan Harga Barang wajib diisi dengan nilai lebih dari 0",
        });
        continue;
      }

      if (!memberNo || tenor <= 0 || tenor > 600) {
        errorData.push({
          row: i + 2,
          reason: "Kolom wajib (No. Anggota, Tenor 1-600 bulan) tidak lengkap/valid",
        });
        continue;
      }

      if (dp < 0 || dp >= hargaBarang) {
        errorData.push({
          row: i + 2,
          reason: "DP harus >= 0 dan lebih kecil dari Harga Barang",
        });
        continue;
      }

      if (margin < 0) {
        errorData.push({ row: i + 2, reason: "Margin tidak boleh negatif" });
        continue;
      }

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) },
        transaction,
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      // Cegah duplikasi saat file yang sama diunggah ulang.
      const duplicate = await FinancingApplication.findOne({
        where: {
          member_id: existingMember.member_id,
          category: kategori,
          purpose: namaBarang,
          item_price: hargaBarang,
          down_payment: dp,
          cooperation_months: tenor,
        },
        transaction,
      });

      if (duplicate) {
        errorData.push({
          row: i + 2,
          reason: "Kontrak dengan data yang sama sudah ada (duplikat)",
        });
        continue;
      }

      const amountRequested = hargaBarang - dp;
      const totalTagihan = amountRequested + margin;
      const monthlyInstallment = totalTagihan / tenor;

      try {
        const newFinancing = await FinancingApplication.create({
          member_id: existingMember.member_id,
          category: kategori,
          purpose: namaBarang,
          item_price: hargaBarang,
          down_payment: dp,
          amount_requested: amountRequested,
          margin_amount: margin,
          total_tagihan: totalTagihan,
          cooperation_months: tenor,
          monthly_installment: monthlyInstallment,
          keterangan,
          status: statusInput,
          akad_type: "Murabahah",
        }, { transaction });
        successData.push(newFinancing);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    await transaction.commit();
    transaction = null;

    return res.status(200).json({
      success: true,
      message: "Proses import Jual Beli selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData
      }
    });

  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Import Jual Beli Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import Jual Beli",
    });
  }
};
