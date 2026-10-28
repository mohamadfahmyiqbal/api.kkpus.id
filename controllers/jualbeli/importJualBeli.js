import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member, FinancingApplication, sequelize } = db;

export const importJualBeli = async (req, res) => {
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

    // Header Template mendukung:
    // "No. Anggota", "Type / Kategori" atau "Kategori", "Nama Barang", "Harga Barang", "DP", "Margin (Rp)", "Tenor (Bulan)", "Status", "Keterangan"
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
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

      // Jika nama barang kosong atau harga 0, lewati baris ini (tidak diimpor)
      if (!namaBarang || hargaBarang <= 0) {
        continue;
      }

      if (!memberNo || tenor <= 0) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Nama Barang, Harga Barang, Tenor) tidak lengkap/valid" });
        continue;
      }

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
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
          keterangan: keterangan,
          status: statusInput, // APPROVED / PENDING / COMPLETED sesuai status transaksi
          akad_type: "Murabahah",
        });
        successData.push(newFinancing);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

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
    console.error("Import Jual Beli Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import Jual Beli",
      error: error.message
    });
  }
};
