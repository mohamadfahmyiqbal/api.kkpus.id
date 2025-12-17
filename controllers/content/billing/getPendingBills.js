import db from "../../../models/index.js";

// Ambil model dari db object
const { Bill, BillType } = db;

/**
 * Mengambil daftar tagihan UNPAID/PENDING berdasarkan userId dari Token (MidAnggota)
 */
const getPendingBills = async (req, res) => {
  try {
    // 1. Ambil memberId dari MidAnggota (req.userId)
    const memberId = req.userId;
    const { limit } = req.query;

    if (!memberId) {
      return res.status(401).json({
        status: false,
        message: "Otorisasi gagal: ID Anggota tidak ditemukan dalam token.",
      });
    }

    const billLimit = limit ? parseInt(limit, 10) : 10;

    // 2. Query data menggunakan member_id (ID Fisik), bukan member_no (String)
    // agar relasi database lebih cepat dan akurat.
    const { count, rows } = await Bill.findAndCountAll({
      where: {
        member_id: memberId,
        status: "UNPAID", // Sesuaikan dengan status di database Anda
      },
      include: [
        {
          model: BillType,
          as: "billType", // Pastikan alias ini sama dengan di models/index.js
          attributes: ["type_name", "tx_type", "category_map"],
        },
      ],
      limit: billLimit,
      order: [["createdAt", "DESC"]], // Urutkan dari yang terbaru
    });

    // 3. Format respons agar konsisten dengan kebutuhan UI
    // Menghilangkan formatting mata uang di backend agar frontend bisa mengolah angkanya
    return res.status(200).json({
      status: true,
      message: "Daftar tagihan berhasil diambil.",
      total_count: count,
      data: rows, // Mengirim objek asli agar frontend bisa akses billType
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
