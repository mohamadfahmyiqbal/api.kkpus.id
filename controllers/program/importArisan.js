import xlsx from "xlsx";
import db from "../../models/index.js";

const { Member, FinancingApplication } = db;

export const importArisan = async (req, res) => {
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

    // Header Template: No. Anggota, Nama Arisan, Nilai Arisan, Biaya Admin (Rp), Tenor (Bulan), Keterangan
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const namaArisan = row["Nama Arisan"];
      const nilaiArisan = parseFloat(row["Nilai Arisan"]) || 0;
      const admin = parseFloat(row["Biaya Admin (Rp)"]) || 0;
      const tenor = parseInt(row["Tenor (Bulan)"]) || 0;
      const keterangan = row["Keterangan"] || "Import Data Pengajuan Arisan";

      if (!memberNo || !namaArisan || nilaiArisan <= 0 || tenor <= 0) {
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
      error: error.message
    });
  }
};
