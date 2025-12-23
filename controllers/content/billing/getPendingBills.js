import db from "../../../models/index.js";

const { Bill, BillType } = db;

/**
 * Mengambil daftar tagihan UNPAID/PENDING dengan filter kategori dinamis
 */
const getPendingBills = async (req, res) => {
  try {
    const memberId = req.userId;
    // Menangkap category dari query params (misal: ?category=Simpanan Wajib)
    const { limit, category } = req.query;

    if (!memberId) {
      return res.status(401).json({
        status: false,
        message: "Otorisasi gagal: ID Anggota tidak ditemukan dalam token.",
      });
    }

    const billLimit = limit ? parseInt(limit, 10) : 10;

    // Menyiapkan filter untuk BillType (Tabel Relasi)
    let billTypeCondition = {};
    if (category) {
      // Filter berdasarkan category_map sesuai permintaan di frontend
      billTypeCondition.category_map = category;
    }

    const { count, rows } = await Bill.findAndCountAll({
      where: {
        member_id: memberId,
        status: "UNPAID",
      },
      include: [
        {
          model: BillType,
          as: "billType",
          attributes: ["type_name", "tx_type", "category_map"],
          // Menerapkan filter kategori di sini
          where:
            Object.keys(billTypeCondition).length > 0
              ? billTypeCondition
              : null,
          required: category ? true : false, // Jika ada kategori, gunakan INNER JOIN agar data terfilter
        },
      ],
      limit: billLimit,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: true,
      message: category
        ? `Daftar tagihan kategori ${category} berhasil diambil.`
        : "Semua daftar tagihan berhasil diambil.",
      total_count: count,
      data: rows,
    });
  } catch (error) {
    console.error("Kesalahan getPendingBills:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};

export default getPendingBills;
