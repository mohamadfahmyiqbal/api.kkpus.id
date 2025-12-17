import db from "../../../models/index.js";

const { Transaction } = db;

export const getFinancialSummary = async (req, res) => {
  try {
    const memberId = req.userId; // Diambil dari middleware autentikasi

    // 1. Ambil semua transaksi sukses milik anggota ini
    const successfulTransactions = await Transaction.findAll({
      where: {
        member_id: memberId,
        status: "PAID", // Hanya hitung yang sudah lunas
      },
      attributes: ["amount", "tx_type", "tx_category"],
    });

    // 2. Kalkulasi saldo secara dinamis berdasarkan data transaksi
    let totalSavings = 0;
    let totalLoanDebt = 0; // Sementara 0 jika modul pinjaman belum ada
    let totalSHU = 0; // Sementara 0 jika modul SHU belum ada

    successfulTransactions.forEach((tx) => {
      const amount = parseFloat(tx.amount);

      // Hitung Simpanan (Semua transaksi bertipe SETORAN masuk ke saldo simpanan)
      if (tx.tx_type === "SETORAN") {
        totalSavings += amount;
      }
      // Jika ada penarikan, kurangi saldo simpanan
      else if (tx.tx_type === "PENARIKAN") {
        totalSavings -= amount;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Data ringkasan keuangan berhasil diambil",
      data: {
        totalSavings: totalSavings,
        totalLoanDebt: totalLoanDebt,
        totalSHU: totalSHU,
        // Anda bisa menambahkan detail per kategori jika dibutuhkan:
        // totalMandatorySavings, totalInitialSavings, dll.
      },
    });
  } catch (error) {
    console.error("Financial Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil ringkasan keuangan.",
      error: error.message,
    });
  }
};
