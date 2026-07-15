import db from "../../models/index.js";
import { sendGlobalNotification } from "../../services/notificationHelper.js";

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

const getJualBeliReport = async (req, res) => {
  try {
    const { FinancingApplication, BillItem, Member, LoanProduct, Sequelize } = db;
    const Op = Sequelize.Op;
    
    // Get valid loan product names to distinguish Jual Beli
    const loanProducts = await LoanProduct.findAll({ attributes: ['product_name'] });
    const loanProductNames = loanProducts.map(p => p.product_name) || [];

    // Fetch all Jual Beli applications with their Member
    const history = await FinancingApplication.findAll({
      where: {
        category: {
          [Op.and]: [
            { [Op.notIn]: [...loanProductNames, 'Arisan', 'Pelunasan Jual Beli'] },
            { [Op.notLike]: '%pelunasan%' }
          ]
        },
        status: { [Op.in]: ['APPROVED', 'COMPLETED', 'ACTIVE', 'LUNAS'] }
      },
      include: [
        {
          model: Member,
          as: 'member',
          attributes: ['full_name', 'member_id']
        }
      ],
      order: [[{ model: Member, as: 'member' }, 'full_name', 'ASC'], ['created_at', 'DESC']]
    });

    // Extract member IDs for filtering BillItems
    const memberIds = [...new Set(history.map(h => h.member_id))];

    // Fetch PAID BillItems
    const paidItems = await BillItem.findAll({
      where: {
        member_id: { [Op.in]: memberIds },
        category_code: {
          [Op.in]: ['TRANSACTION_INSTALLMENT', 'TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN']
        },
        status: 'PAID'
      }
    });

    const itemsByApp = {};
    paidItems.forEach(item => {
      const appId = item.financing_application_id;
      if (appId) {
        if (!itemsByApp[appId]) itemsByApp[appId] = [];
        itemsByApp[appId].push(item);
      }
    });

    const currentYear = new Date().getFullYear();
    const dataByMember = {};

    history.forEach(h => {
      const memberId = h.member_id;
      if (!dataByMember[memberId]) {
        dataByMember[memberId] = {
          id: memberId,
          nama: h.member?.full_name || 'Anggota',
          tahun_ini: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
          tahun_lalu: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
          tahun_lalu2: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 }
        };
      }

      const year = new Date(h.created_at).getFullYear();
      let targetYear = null;
      if (year === currentYear) targetYear = 'tahun_ini';
      else if (year === currentYear - 1) targetYear = 'tahun_lalu';
      else if (year === currentYear - 2) targetYear = 'tahun_lalu2';

      if (targetYear) {
        const pokok = parseFloat(h.item_price || h.amount_requested || 0) + parseFloat(h.operational_cost || 0);
        const margin = parseFloat(h.margin_amount || 0);
        const dp = parseFloat(h.down_payment || 0);
        
        const appPaidItems = itemsByApp[h.financing_id] || [];
        const totalPaidForApp = appPaidItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
        const hasPaidDPInApp = appPaidItems.some(item => ['TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN'].includes(item.category_code));
        
        const effectivePaidAmount = totalPaidForApp + (!hasPaidDPInApp && dp > 0 ? dp : 0);
        const cicilan = Math.max(0, effectivePaidAmount - dp);

        dataByMember[memberId][targetYear].pokok += pokok;
        dataByMember[memberId][targetYear].margin += margin;
        dataByMember[memberId][targetYear].dp += dp;
        dataByMember[memberId][targetYear].cicilan += cicilan;
        dataByMember[memberId][targetYear].total += pokok + margin;
      }
    });

    const result = Object.values(dataByMember);

    return res.status(200).json({
      status: true,
      data: result
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
  getTransactionOptions,
  getJualBeliReport
};
