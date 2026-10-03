import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member, FinancingApplication } = db;

export const importPendanaan = async (req, res) => {
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

    // Header Template: No. Anggota, Nama Pendanaan, Jumlah Pendanaan (Rp), Tenor (Bulan), Margin/Bagi Hasil (Rp), Keterangan
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const namaPendanaan = row["Nama Pendanaan"];
      const jumlahPendanaan = parseFloat(row["Jumlah Pendanaan (Rp)"]) || 0;
      const margin = parseFloat(row["Margin/Bagi Hasil (Rp)"]) || 0;
      const tenor = parseInt(row["Tenor (Bulan)"]) || 0;
      const keterangan = row["Keterangan"] || "Import Data Pendanaan Syariah";

      if (!memberNo || !namaPendanaan || jumlahPendanaan <= 0 || tenor <= 0) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Nama Pendanaan, Jumlah, Tenor) tidak lengkap/valid" });
        continue;
      }

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      const totalTagihan = jumlahPendanaan + margin;
      const monthlyInstallment = totalTagihan / tenor;

      try {
        const newFinancing = await FinancingApplication.create({
          member_id: existingMember.member_id,
          category: "Pendanaan Syariah UMKM",
          purpose: namaPendanaan, 
          amount_requested: jumlahPendanaan,
          margin_amount: margin,
          total_tagihan: totalTagihan,
          cooperation_months: tenor,
          monthly_installment: monthlyInstallment,
          keterangan: keterangan,
          status: "COMPLETED", // Diset COMPLETED agar masuk ke rekap aktif
          akad_type: "Mudharabah", // Default akad pendanaan syariah
        });
        successData.push(newFinancing);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import Pendanaan Syariah selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData
      }
    });

  } catch (error) {
    console.error("Import Pendanaan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import Pendanaan",
      error: error.message
    });
  }
};
