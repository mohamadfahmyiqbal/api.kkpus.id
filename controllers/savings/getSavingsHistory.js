// src/controllers/savings/getSavingsHistory.js
import db from "../../models/index.js";
import { Op } from "sequelize";

export const getSavingsHistory = async (req, res) => {
  try {
    const memberId = req.userId; // Diambil dari middleware autentikasi Anda
    const { category } = req.query; // e.g., "Simpanan Pokok" atau "Simpanan Wajib"

    /**
     * Penjelasan Query:
     * 1. Mencari di tabel Transaction yang statusnya 'PAID'
     * 2. Join ke tabel Bill (melalui bill_id)
     * 3. Join ke tabel BillItem (melalui bill_id) dan FILTER berdasarkan deskripsi (Simpanan Pokok/Wajib)
     * 4. Join ke tabel BillType untuk mengambil data Akad (category_map)
     */
    const transactions = await db.Transaction.findAll({
      attributes: ["transaction_id", "amount", "status", "created_at"],
      where: {
        member_id: memberId,
        status: "PAID",
      },
      include: [
        {
          // TAMBAHKAN INI: Ambil data nama anggota
          model: db.Member,
          as: "member",
          attributes: ["full_name"], // Sesuaikan jika nama kolomnya 'name' atau 'nama'
        },
        {
          model: db.Bill,
          as: "bill",
          required: true,
          include: [
            {
              model: db.BillItem,
              as: "items",
              required: true,
              where: category
                ? { description: { [Op.like]: `%${category}%` } }
                : {},
              attributes: ["amount", "description"],
            },
            {
              model: db.BillType,
              as: "billType",
              attributes: ["category_map"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    if (!transactions || transactions.length === 0) {
      return res.status(200).json({
        status: true,
        message: "Belum ada riwayat simpanan untuk kategori ini.",
        data: [],
      });
    }

    return res.status(200).json({
      status: true,
      message: "Data riwayat simpanan berhasil diambil",
      data: transactions,
    });
  } catch (error) {
    console.error("Error getSavingsHistory:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
