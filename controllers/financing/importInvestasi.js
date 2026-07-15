import xlsx from "xlsx";
import db from "../../models/index.js";
import { v4 as uuidv4 } from "uuid";

const { Member, SukukIssue, SukukOrder } = db;

export const importInvestasi = async (req, res) => {
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

    // Header Template: No. Anggota, Nama Produk Investasi, Nilai Investasi (Rp), Durasi (Bulan), Proyeksi Bagi Hasil (%), Keterangan
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const namaProduk = row["Nama Produk Investasi"];
      const nilaiInvestasi = parseFloat(row["Nilai Investasi (Rp)"]) || 0;
      const durasi = parseInt(row["Durasi (Bulan)"]) || 12;
      const profitRate = parseFloat(row["Proyeksi Bagi Hasil (%)"]) || 10;
      const keterangan = row["Keterangan"] || "Import Investasi Halal";

      if (!memberNo || !namaProduk || nilaiInvestasi <= 0) {
        errorData.push({ row: i + 2, reason: "Kolom wajib (No. Anggota, Nama Produk, Nilai) tidak lengkap/valid" });
        continue;
      }

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      // Check if SukukIssue exists by name
      let sukukIssue = await SukukIssue.findOne({
        where: { issue_name: namaProduk }
      });

      // If not, create a dummy one based on the excel data
      if (!sukukIssue) {
        const currentDate = new Date();
        const endDate = new Date(currentDate);
        endDate.setMonth(endDate.getMonth() + durasi);

        sukukIssue = await SukukIssue.create({
          issue_name: namaProduk,
          description: "Produk dibuat otomatis via Import Excel",
          target_amount: 100000000, // Dummy target
          min_investment: 100000,
          profit_rate: profitRate,
          term_months: durasi,
          status: "OPEN",
          start_date: currentDate,
          end_date: endDate,
        });
      }

      try {
        const orderId = `INV-${Date.now()}-${uuidv4().substring(0, 4)}`;

        const newOrder = await SukukOrder.create({
          order_id: orderId,
          sukuk_issue_id: sukukIssue.sukuk_issue_id,
          member_id: existingMember.member_id,
          amount: nilaiInvestasi,
          status: "PAID", // Otomatis lunas agar tercatat
          payment_proof: null,
          created_at: new Date(),
        });
        successData.push(newOrder);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import Investasi Halal selesai",
      data: {
        totalImported: successData.length,
        totalFailed: errorData.length,
        errors: errorData
      }
    });

  } catch (error) {
    console.error("Import Investasi Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat import Investasi",
      error: error.message
    });
  }
};
