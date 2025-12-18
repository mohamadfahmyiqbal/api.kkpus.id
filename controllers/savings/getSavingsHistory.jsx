// 📁 controllers/savings/getSavingsHistory.js
import db from "../../models/index.js";

const { Transaction, BillType } = db;

/**
 * Controller untuk mengambil riwayat simpanan anggota
 * Sesuai dengan pemanggilan USimpanan.getSavingsHistory di frontend
 */
export const getSavingsHistory = async (req, res) => {
  try {
    // id_anggota didapat dari middleware auth (req.userId)
    const memberId = req.userId;

    // Menangkap 'category' dari query params (?category=SW_WAJIB)
    const { category } = req.query;

    // Filter dasar untuk transaksi anggota yang sudah sukses (SETTLED/LUNAS)
    const whereCondition = {
      member_id: memberId,
      status: "SETTLED",
    };

    // Filter tambahan berdasarkan tx_category jika ada
    if (category) {
      whereCondition.tx_category = category;
    }

    const history = await Transaction.findAll({
      where: whereCondition,
      include: [
        {
          model: BillType,
          as: "billType", // Pastikan alias sesuai dengan asosiasi model Anda
          attributes: ["category_map", "bill_name"], // category_map digunakan frontend untuk info 'Akad'
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: "Data riwayat simpanan berhasil diambil",
      data: history,
    });
  } catch (error) {
    console.error("Backend Error:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};
