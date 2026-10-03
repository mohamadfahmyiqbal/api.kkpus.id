import xlsx from "xlsx";
import db from "../../models/index.js";
const Member = db.Member;
const Savings = db.Savings;

export const importSimpanan = async (req, res) => {
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

    // Format Excel: No. Anggota, Jenis Simpanan, Nominal, Tanggal Transaksi, Keterangan
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const jenisSimpanan = row["Jenis Simpanan"] ? String(row["Jenis Simpanan"]).toUpperCase() : "";
      const nominal = row["Nominal"];
      
      // Tangani tanggal dari Excel (bisa berupa serial number atau string)
      let tanggal = row["Tanggal Transaksi"];
      let txDate;
      if (typeof tanggal === 'number') {
        // Excel serial date to JS Date
        txDate = new Date((tanggal - (25567 + 2)) * 86400 * 1000);
      } else {
        txDate = new Date(tanggal);
      }
      
      const keterangan = row["Keterangan"];

      if (!memberNo || !jenisSimpanan || !nominal || !tanggal) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Jenis Simpanan, Nominal, Tanggal) tidak boleh kosong" });
        continue;
      }

      // Validasi jenis simpanan
      const validJenis = ["SUKARELA", "WAJIB", "BERJANGKA", "POKOK"];
      if (!validJenis.includes(jenisSimpanan)) {
        errorData.push({ row: i + 2, reason: `Jenis Simpanan '${jenisSimpanan}' tidak valid (pilih: SUKARELA, WAJIB, BERJANGKA, POKOK)` });
        continue;
      }

      // Validasi nominal
      if (isNaN(parseFloat(nominal))) {
        errorData.push({ row: i + 2, reason: "Nominal harus berupa angka" });
        continue;
      }

      // Validasi tanggal
      if (isNaN(txDate.getTime())) {
        errorData.push({ row: i + 2, reason: "Format Tanggal Transaksi tidak valid" });
        continue;
      }

      // Cari anggota berdasarkan No. Anggota
      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      try {
        const newSaving = await Savings.create({
          member_id: existingMember.member_id,
          savings_type: jenisSimpanan,
          amount: parseFloat(nominal),
          description: keterangan || "Import Data Simpanan",
          transaction_date: txDate.toISOString().split('T')[0],
          status: "COMPLETED", // Langsung sukses karena data historis/import
        });
        successData.push(newSaving);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import simpanan selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData
      }
    });

  } catch (error) {
    console.error("Import Simpanan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import simpanan",
      error: error.message
    });
  }
};
