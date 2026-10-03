import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member, FinancingApplication } = db;

export const importPinjaman = async (req, res) => {
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

    // Header Template: No. Anggota, Kategori, Nama Pinjaman, Jumlah Pinjaman, Margin/Bunga (Rp), Tenor (Bulan), Keterangan
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const kategori = row["Kategori"] || "Pinjaman Tunai";
      const namaPinjaman = row["Nama Pinjaman"];
      const jumlahPinjaman = parseFloat(row["Jumlah Pinjaman"]) || 0;
      const margin = parseFloat(row["Margin/Bunga (Rp)"]) || 0;
      const tenor = parseInt(row["Tenor (Bulan)"]) || 0;
      const keterangan = row["Keterangan"] || "Import Data Pinjaman Lunak";

      if (!memberNo || !namaPinjaman || jumlahPinjaman <= 0 || tenor <= 0) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Nama Pinjaman, Jumlah, Tenor) tidak lengkap/valid" });
        continue;
      }

      // Pastikan nama pinjaman berawalan 'Pinjaman' agar terbaca di dashboard Pinjaman
      const finalPurpose = namaPinjaman.toLowerCase().startsWith('pinjaman') ? namaPinjaman : `Pinjaman ${namaPinjaman}`;

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      const totalTagihan = jumlahPinjaman + margin;
      const monthlyInstallment = totalTagihan / tenor;

      try {
        const newFinancing = await FinancingApplication.create({
          member_id: existingMember.member_id,
          category: kategori,
          purpose: finalPurpose, 
          amount_requested: jumlahPinjaman,
          margin_amount: margin,
          total_tagihan: totalTagihan,
          cooperation_months: tenor,
          monthly_installment: monthlyInstallment,
          keterangan: keterangan,
          status: "COMPLETED", // Diset COMPLETED agar masuk ke rekap history lunas/aktif
          akad_type: "Qardh", // Biasanya pinjaman lunak akadnya Qardh
        });
        successData.push(newFinancing);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import Pinjaman Lunak selesai",
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
      error: error.message
    });
  }
};
