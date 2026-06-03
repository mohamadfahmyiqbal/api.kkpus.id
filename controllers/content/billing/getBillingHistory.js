// src/controllers/content/billing/getBillingHistory.js
import db from "../../../models/index.js";
import { Op } from "sequelize";

// PERBAIKAN: Gunakan nama properti yang sesuai dengan db.Bill dan db.BillItem di initModels.js
const { Bill, BillItem } = db;

/**
 * Mengambil riwayat tagihan PAID/SETTLED
 */
const getBillingHistory = async (req, res) => {
  try {
    const memberId = req.userId;
    const { limit, category } = req.query;

    if (!memberId) {
      return res.status(401).json({
        status: false,
        message: "Otorisasi gagal.",
      });
    }

    // Pastikan Bill terdefinisi sebelum memanggil findAll
    if (!Bill) {
      throw new Error("Model 'Bill' tidak ditemukan di database object.");
    }

    const historyLimit = limit ? parseInt(limit, 10) : 20;

    const rows = await Bill.findAll({
      where: {
        member_id: memberId,
        status: {
          [Op.in]: ["PAID", "SETTLED"]
        },
      },
      include: [
        {
          model: BillItem,
          as: "items", // Pastikan alias ini sesuai dengan defineAssociations (db.Bill.hasMany(db.BillItem, { as: "items" }))
          where: category
            ? {
                description: {
                  [Op.like]: `%${category}%`,
                },
              }
            : null,
          required: category ? true : false,
        },
      ],
      limit: historyLimit,
      // Menggunakan nama kolom fisik agar aman dari isu camelCase/snake_case
      order: [["updated_at", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Riwayat item berhasil diambil sesuai kategori.",
      data: rows,
    });
  } catch (error) {
    console.error("Kesalahan getBillingHistory:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};

export default getBillingHistory;