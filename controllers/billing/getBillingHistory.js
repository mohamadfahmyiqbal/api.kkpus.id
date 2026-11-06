import db from "../../models/index.js";
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

    const rows = await BillItem.findAll({
      where: (() => {
        const cond = {
          member_id: memberId,
          status: {
            [Op.in]: ["PAID", "paid", "SETTLED", "settled", "SUCCESS", "success"]
          }
        };
        if (category) {
          cond[Op.or] = [
            { category_code: category },
            { description: { [Op.like]: `%${category}%` } }
          ];
        }
        return cond;
      })(),
      include: [
        {
          model: db.BillType,
          as: "type",
          attributes: ["type_name", "category_map"],
          required: false,
        },
        {
          model: Bill,
          as: "bill",
          attributes: ["status", "updated_at"],
          required: false,
        }
      ],
      limit: historyLimit,
      order: [["updated_at", "DESC"]],
    });

    let resultData = [...rows];

    // Jika kategori simpanan, sertakan juga riwayat dari db.Savings (data import / setoran langsung)
    if (db.Savings && category) {
      let targetType = null;
      const catUpper = category.toUpperCase();
      if (catUpper.includes("POKOK")) targetType = "POKOK";
      else if (catUpper.includes("WAJIB")) targetType = "WAJIB";
      else if (catUpper.includes("SUKARELA")) targetType = "SUKARELA";

      if (targetType) {
        const directSavings = await db.Savings.findAll({
          where: {
            member_id: memberId,
            savings_type: targetType,
            status: { [Op.in]: ["COMPLETED", "APPROVED"] }
          },
          order: [["transaction_date", "DESC"], ["created_at", "DESC"]],
          limit: historyLimit
        });

        // Deduplicate against billing items (match by amount and date)
        const existingKeys = new Set(
          rows.map(r => {
            const dateStr = r.updated_at || r.createdAt ? new Date(r.updated_at || r.createdAt).toISOString().split('T')[0] : '';
            return `${parseFloat(r.amount || 0)}_${dateStr}`;
          })
        );

        const filteredDirectSavings = directSavings.filter(s => {
          const sDate = s.transaction_date || (s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : '');
          const key = `${parseFloat(s.amount || 0)}_${sDate}`;
          return !existingKeys.has(key);
        });

        const extraItems = filteredDirectSavings.map(s => ({
          id: s.savings_id,
          bill_item_id: s.savings_id,
          category_code: category,
          description: s.description || `Simpanan ${s.savings_type.charAt(0).toUpperCase() + s.savings_type.slice(1).toLowerCase()}`,
          amount: parseFloat(s.amount || 0),
          status: "PAID",
          createdAt: s.transaction_date || s.created_at,
          updated_at: s.updated_at || s.created_at,
          type: {
            type_name: `Simpanan ${s.savings_type.charAt(0).toUpperCase() + s.savings_type.slice(1).toLowerCase()}`,
            category_map: category
          }
        }));

        resultData = [...resultData, ...extraItems];
      }
    }

    return res.status(200).json({
      status: true,
      message: "Riwayat item berhasil diambil sesuai kategori.",
      data: resultData,
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