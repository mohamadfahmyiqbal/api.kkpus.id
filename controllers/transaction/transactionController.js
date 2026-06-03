import db from "../../models/index.js";
import { sendGlobalNotification } from "../utility/notificationHelper.js";

const createTransaction = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const memberId = req.userId;
    const {
      transaction_type,
      category,
      item_name,
      amount,
      description
    } = req.body;

    // Validasi input
    if (!transaction_type || !['PEMBELIAN', 'PEMBAYARAN', 'TOPUP', 'LAINNYA'].includes(transaction_type)) {
      throw new Error("Tipe transaksi tidak valid");
    }
    if (!category || !item_name || !amount || amount <= 0) {
      throw new Error("Data transaksi tidak lengkap atau tidak valid");
    }

    // Create transaction
    const newTransaction = await db.GeneralTransaction.create({
      member_id: memberId,
      transaction_type: transaction_type,
      category: category,
      item_name: item_name,
      amount: amount,
      description: description || null,
      status: 'COMPLETED' // Transaksi umum langsung completed
    }, { transaction: t });

    await t.commit();

    // Kirim notifikasi
    setImmediate(async () => {
      try {
        await sendGlobalNotification({
          memberId: memberId,
          title: "Transaksi Berhasil",
          content: `Transaksi ${transaction_type} untuk ${item_name} senilai Rp ${Number(amount).toLocaleString('id-ID')} telah diproses.`,
          type: "TRANSACTION",
          url: "/transaksi"
        });
      } catch (err) {
        console.error("Notification Error:", err.message);
      }
    });

    return res.status(201).json({
      status: true,
      message: "Transaksi berhasil diproses.",
      data: {
        transaction_id: newTransaction.transaction_id,
        transaction_type: newTransaction.transaction_type,
        amount: newTransaction.amount,
        status: newTransaction.status
      }
    });

  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const memberId = req.userId;
    const { page = 1, limit = 10, transaction_type, status } = req.query;

    const whereClause = { member_id: memberId };
    if (transaction_type) whereClause.transaction_type = transaction_type;
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: transactions } = await db.GeneralTransaction.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    return res.status(200).json({
      status: true,
      message: "Data transaksi berhasil diambil",
      data: {
        transactions: transactions,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_records: count,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

const getTransactionDetail = async (req, res) => {
  try {
    const memberId = req.userId;
    const { id } = req.params;

    const transaction = await db.GeneralTransaction.findOne({
      where: {
        transaction_id: id,
        member_id: memberId
      }
    });

    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Transaksi tidak ditemukan"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Detail transaksi berhasil diambil",
      data: transaction
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

const getTransactionOptions = async (req, res) => {
  try {
    const options = {
      transaction_types: [
        { value: 'PEMBELIAN', label: 'Pembelian' },
        { value: 'PEMBAYARAN', label: 'Pembayaran' },
        { value: 'TOPUP', label: 'Top Up' },
        { value: 'LAINNYA', label: 'Lainnya' }
      ],
      categories: [
        'Elektronik',
        'Kendaraan',
        'Property',
        'Pendidikan',
        'Kesehatan',
        'Konsumsi',
        'Lainnya'
      ]
    };

    return res.status(200).json({
      status: true,
      message: "Opsi transaksi berhasil diambil",
      data: options
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export {
  createTransaction,
  getTransactionHistory,
  getTransactionDetail,
  getTransactionOptions
};
