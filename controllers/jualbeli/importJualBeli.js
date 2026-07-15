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

    // Header Template: No. Anggota, Kategori, Nama Barang, Harga Barang, DP, Margin (Rp), Tenor (Bulan), Keterangan
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const kategori = row["Kategori"];
      const namaBarang = row["Nama Barang"];
      const hargaBarang = parseFloat(row["Harga Barang"]) || 0;
      const dp = parseFloat(row["DP"]) || 0;
      const margin = parseFloat(row["Margin (Rp)"]) || 0;
      const tenor = parseInt(row["Tenor (Bulan)"]) || 0;
      const keterangan = row["Keterangan"] || "Import Data Jual Beli";

      if (!memberNo || !kategori || !namaBarang || hargaBarang <= 0 || tenor <= 0) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Kategori, Nama Barang, Harga, Tenor) tidak lengkap/valid" });
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
          status: "COMPLETED", // Status lunas/berjalan, diset COMPLETED mengikuti asumsi histori 
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
