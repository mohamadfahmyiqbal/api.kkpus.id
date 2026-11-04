// src/controllers/savings/getSavingsHistory.js
import db from "../../models/index.js";
import { Op } from "sequelize";

export const getSavingsHistory = async (req, res) => {
  try {
    const memberId = req.userId; // Diambil dari middleware autentikasi Anda
    let { category } = req.query; // e.g., "Simpanan Pokok" atau "Simpanan Wajib"

    // Validasi input category
    if (category && typeof category !== "string") {
      return res.status(400).json({
        status: false,
        message: "Parameter kategori harus berupa string."
      });
    }

    // Fallback jika category terkirim sebagai serialized array index oleh Axios (?0=S&1=S...)
    if (!category && req.query['0']) {
      category = Object.keys(req.query)
        .filter((k) => !isNaN(k))
        .sort((a, b) => a - b)
        .map((k) => req.query[k])
        .join('');
    }

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
      // Fallback: Jika tidak ada transaksi dari sistem Billing, ambil dari data Savings (import / langsung)
      if (db.Savings) {
        let targetType = null;
        if (category) {
          const catUpper = category.toUpperCase();
          if (catUpper.includes("POKOK")) targetType = "POKOK";
          else if (catUpper.includes("WAJIB")) targetType = "WAJIB";
          else if (catUpper.includes("SUKARELA")) targetType = "SUKARELA";
        }

        const savingsWhere = {
          member_id: memberId,
          status: { [Op.in]: ["COMPLETED", "APPROVED"] }
        };
        if (targetType) {
          savingsWhere.savings_type = targetType;
        }

        const directSavings = await db.Savings.findAll({
          where: savingsWhere,
          include: [
            {
              model: db.Member,
              as: "member",
              attributes: ["full_name"],
            }
          ],
          order: [["transaction_date", "DESC"], ["created_at", "DESC"]],
        });

        if (directSavings && directSavings.length > 0) {
          const mapped = directSavings.map(s => ({
            transaction_id: s.savings_id,
            id: s.savings_id,
            amount: parseFloat(s.amount || 0),
            status: "PAID",
            created_at: s.transaction_date || s.created_at,
            type: "DEPOSIT",
            description: s.description || `Simpanan ${s.savings_type}`,
            member: s.member
          }));

          return res.status(200).json({
            status: true,
            message: "Data riwayat simpanan berhasil diambil",
            data: mapped,
          });
        }
      }

      return res.status(200).json({
        status: true,
        message: "Belum ada riwayat simpanan untuk kategori ini.",
        data: [],
      });
    }

    const mappedTransactions = transactions.map((t) => {
      const item = t.toJSON ? t.toJSON() : t;
      return {
        ...item,
        id: item.transaction_id,
        type: "DEPOSIT",
        description: item.bill?.items?.[0]?.description || `Simpanan ${category || ""}`.trim(),
        amount: parseFloat(item.amount || 0),
      };
    });

    return res.status(200).json({
      status: true,
      message: "Data riwayat simpanan berhasil diambil",
      data: mappedTransactions,
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
