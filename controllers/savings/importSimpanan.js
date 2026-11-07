import { readExcelBuffer } from "../../utils/excelGenerator.js";
import db from "../../models/index.js";

const { Member, Simpanan, SimpananTransaction } = db;

export const importSimpanan = async (req, res) => {
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

    // Header Template: No. Anggota, Jenis Simpanan, Nominal, Tanggal Transaksi, Keterangan
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const memberNo = row["No. Anggota"];
      const jenisSimpanan = (row["Jenis Simpanan"] || "SUKARELA").toString().trim().toUpperCase();
      const nominal = parseFloat(row["Nominal"]) || 0;
      const tanggal = row["Tanggal Transaksi"] ? new Date(row["Tanggal Transaksi"]) : new Date();
      const keterangan = row["Keterangan"] || "Import Simpanan";

      if (!memberNo || nominal <= 0) {
        errorData.push({ row: i + 2, reason: "No. Anggota atau Nominal tidak valid" });
        continue;
      }

      const existingMember = await Member.findOne({
        where: { member_no: String(memberNo) }
      });

      if (!existingMember) {
        errorData.push({ row: i + 2, reason: `Anggota dengan No. ${memberNo} tidak ditemukan` });
        continue;
      }

      try {
        let simpanan = await Simpanan.findOne({
          where: { member_id: existingMember.member_id }
        });

        if (!simpanan) {
          simpanan = await Simpanan.create({
            member_id: existingMember.member_id,
            simpanan_pokok: 0,
            simpanan_wajib: 0,
            simpanan_sukarela: 0,
          });
        }

        const tx = await SimpananTransaction.create({
          simpanan_id: simpanan.simpanan_id,
          transaction_type: "SETORAN",
          amount: nominal,
          savings_type: jenisSimpanan,
          description: keterangan,
          transaction_date: tanggal,
        });

        if (jenisSimpanan === "POKOK") {
          await simpanan.increment("simpanan_pokok", { by: nominal });
        } else if (jenisSimpanan === "WAJIB") {
          await simpanan.increment("simpanan_wajib", { by: nominal });
        } else {
          await simpanan.increment("simpanan_sukarela", { by: nominal });
        }

        successData.push(tx);
      } catch (err) {
        errorData.push({ row: i + 2, reason: err.message });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Proses import Simpanan selesai",
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
      message: "Terjadi kesalahan server saat import Simpanan",
      error: error.message
    });
  }
};
