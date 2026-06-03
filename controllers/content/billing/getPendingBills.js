// 📁 controllers/billing/getPendingBills.js
import db from "../../../models/index.js";
import { Op } from "sequelize";

const { BillType, BillItem } = db;

const getPendingBills = async (req, res) => {
  try {
    const memberId = req.userId;
    const billTypeIdRaw = req.query['bill_type_id[]'] || req.query.bill_type_id;

    if (!memberId) {
      return res.status(401).json({ status: false, message: "Otorisasi gagal." });
    }

    let itemCondition = {
      member_id: memberId,
      status: "UNPAID"
    };

    if (billTypeIdRaw) {
      itemCondition.bill_type_id = Array.isArray(billTypeIdRaw)
        ? { [Op.in]: billTypeIdRaw }
        : billTypeIdRaw;
    }

    const { count, rows } = await BillItem.findAndCountAll({
      where: itemCondition,
      include: [
        {
          model: BillType,
          as: "type",
          attributes: ["type_name", "category_map"],
          required: false,
        }
      ],
      // Gunakan 'createdAt' (Sequelize akan menerjemahkan ke 'created_at' karena underscored: true)
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Data rincian tagihan berhasil diambil.",
      total_count: count,
      data: rows,
    });

  } catch (error) {
    console.error("Error pada getPendingBills:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};

export default getPendingBills;