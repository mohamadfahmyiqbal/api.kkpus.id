// src/controllers/content/billing/getBillingHistory.js
import db from "../../../models/index.js";
import { Op } from "sequelize"; // Import Operator Sequelize

const { Bill, BillType, BillItem } = db;

/**
 * Mengambil riwayat tagihan PAID/SETTLED
 * dengan detail item yang deskripsinya sama dengan kategori
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

    const historyLimit = limit ? parseInt(limit, 10) : 20;

    // Kondisi filter kategori
    let billTypeCondition = {};
    if (category) {
      billTypeCondition.category_map = category;
    }

    const rows = await Bill.findAll({
      where: {
        member_id: memberId,
        status: ["PAID", "SETTLED"],
      },
      include: [
        {
          model: BillItem,
          as: "items",
          // LOGIKA FILTER: deskripsi bill_items harus sama dengan category_map dari BillType
          where: category
            ? {
                description: {
                  [Op.like]: `%${category}%`, // Menggunakan LIKE jika deskripsi mengandung nama kategori
                },
              }
            : null,
          required: category ? true : false,
        },
      ],
      limit: historyLimit,
      order: [["updatedAt", "DESC"]],
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
