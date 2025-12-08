// src/controllers/content/billing/getPendingBills.js (FINAL)

import db from "../../../models/index.js";
import { Op } from "sequelize";

// ✅ PERBAIKAN: Pastikan Bill diambil dari db.Bill yang sudah diinisialisasi
const Bill = db.Bill;

/**
 * Mengambil daftar tagihan yang berstatus 'pending' (tertunda) berdasarkan member_no.
 * Query parameter yang diterima: member_no, limit.
 */
const getPendingBills = async (req, res) => {
  try {
    const { member_no, limit } = req.query;

    // 1. Validasi input wajib
    if (!member_no) {
      return res.status(400).json({
        message: "Parameter member_no wajib diisi.",
        list: [],
        total_count: 0,
      });
    }

    // ✅ VALIDASI KRITIS: Memastikan Bill sudah terdefinisi
    if (!Bill || typeof Bill.findAndCountAll !== "function") {
      console.error("Model Bill tidak terdefinisi atau tidak valid.");
      return res.status(500).json({
        message: "Kesalahan konfigurasi server: Model tagihan tidak ditemukan.",
        list: [],
        total_count: 0,
      });
    }

    const billLimit = limit ? parseInt(limit, 10) : 10;

    // 2. Siapkan Kondisi WHERE: Filter wajib untuk status 'pending'
    const whereCondition = {
      member_no: member_no,
      status: "pending", // Hanya ambil tagihan yang statusnya pending
    };

    // 3. Ambil Data Tagihan
    const { count, rows } = await Bill.findAndCountAll({
      // BARIS TEMPAT ERROR
      where: whereCondition,
      attributes: ["bill_id", "description", "amount", "due_date"],
      limit: billLimit,
      order: [["due_date", "ASC"]],
      raw: true,
    });

    // 4. Format Data Output agar sesuai dengan yang diharapkan Frontend
    const list = rows.map((item) => ({
      id: item.bill_id,
      description: item.description,
      // Format amount menjadi string mata uang
      amount: `Rp ${Number(item.amount).toLocaleString("id-ID")}`,
      due_date: item.due_date,
    }));

    // 5. Kirim Respons Sukses
    return res.status(200).json({
      message: "Daftar tagihan tertunda berhasil diambil.",
      total_count: count,
      list: list,
    });
  } catch (error) {
    console.error("Kesalahan saat mengambil tagihan pending:", error);
    return res.status(500).json({
      message: "Kesalahan server internal saat memproses tagihan.",
      error: error.message,
      list: [],
    });
  }
};

export default getPendingBills;
