import db from "../../models/index.js";
import { sendGlobalNotification } from "../utility/notificationHelper.js";

const createSavingsApplication = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const memberId = req.userId;
    const {
      savings_type,
      amount,
      description,
      transaction_date
    } = req.body;

    // Validasi input
    if (!savings_type || !['SUKARELA', 'WAJIB', 'BERJANGKA'].includes(savings_type)) {
      throw new Error("Tipe simpanan tidak valid");
    }
    if (!amount || amount <= 0) {
      throw new Error("Jumlah simpanan harus lebih dari 0");
    }
    if (!transaction_date) {
      throw new Error("Tanggal transaksi harus diisi");
    }

    // Cek approval flow untuk simpanan
    const flow = await db.ApprovalFlow.findOne({
      where: { entity_ref: 'savings_applications' },
      transaction: t
    });

    if (!flow) {
      // Jika tidak ada approval flow, langsung approve
      const newSavings = await db.Savings.create({
        member_id: memberId,
        savings_type: savings_type,
        amount: amount,
        description: description || null,
        transaction_date: transaction_date,
        status: 'COMPLETED'
      }, { transaction: t });

      await t.commit();

      // Kirim notifikasi
      setImmediate(async () => {
        try {
          await sendGlobalNotification({
            memberId: memberId,
            title: "Simpanan Berhasil",
            content: `Simpanan ${savings_type} senilai Rp ${Number(amount).toLocaleString('id-ID')} telah diproses.`,
            type: "SAVINGS",
            url: "/simpanan"
          });
        } catch (err) {
          console.error("Notification Error:", err.message);
        }
      });

      return res.status(201).json({
        status: true,
        message: "Simpanan berhasil diproses.",
        data: {
          savings_id: newSavings.savings_id,
          savings_type: newSavings.savings_type,
          amount: newSavings.amount,
          status: newSavings.status
        }
      });
    }

    // Jika ada approval flow, proses dengan approval
    const firstStep = await db.ApprovalStep.findOne({
      where: { approval_flow_id: flow.approval_flow_id },
      order: [['step_order', 'ASC']],
      transaction: t
    });

    if (!firstStep) throw new Error("Approval Step belum dikonfigurasi.");

    const newSavings = await db.Savings.create({
      member_id: memberId,
      savings_type: savings_type,
      amount: amount,
      description: description || null,
      transaction_date: transaction_date,
      status: 'PENDING',
      approval_flow_id: flow.approval_flow_id,
      current_step_id: firstStep.approval_step_id
    }, { transaction: t });

    await t.commit();

    // Kirim notifikasi
    setImmediate(async () => {
      try {
        await sendGlobalNotification({
          memberId: memberId,
          title: "Pengajuan Simpanan",
          content: `Pengajuan simpanan ${savings_type} senilai Rp ${Number(amount).toLocaleString('id-ID')} sedang diproses.`,
          type: "SAVINGS",
          url: "/simpanan"
        });
      } catch (err) {
        console.error("Notification Error:", err.message);
      }
    });

    return res.status(201).json({
      status: true,
      message: "Pengajuan simpanan berhasil diproses.",
      data: {
        savings_id: newSavings.savings_id,
        savings_type: newSavings.savings_type,
        amount: newSavings.amount,
        status: newSavings.status
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

const getSavingsHistory = async (req, res) => {
  try {
    const memberId = req.userId;
    const { page = 1, limit = 10, savings_type, status } = req.query;

    const whereClause = { member_id: memberId };
    if (savings_type) whereClause.savings_type = savings_type;
    if (status) whereClause.status = status;

    const offset = (page - 1) * limit;

    const { count, rows: savings } = await db.Savings.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    return res.status(200).json({
      status: true,
      message: "Data simpanan berhasil diambil",
      data: {
        savings: savings,
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

const getSavingsDetail = async (req, res) => {
  try {
    const memberId = req.userId;
    const { id } = req.params;

    const savings = await db.Savings.findOne({
      where: {
        savings_id: id,
        member_id: memberId
      }
    });

    if (!savings) {
      return res.status(404).json({
        status: false,
        message: "Data simpanan tidak ditemukan"
      });
    }

    return res.status(200).json({
      status: true,
      message: "Detail simpanan berhasil diambil",
      data: savings
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

const getSavingsOptions = async (req, res) => {
  try {
    const options = {
      savings_types: [
        { value: 'SUKARELA', label: 'Simpanan Sukarela' },
        { value: 'WAJIB', label: 'Simpanan Wajib' },
        { value: 'BERJANGKA', label: 'Simpanan Berjangka' }
      ]
    };

    return res.status(200).json({
      status: true,
      message: "Opsi simpanan berhasil diambil",
      data: options
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

const getSavingsSummary = async (req, res) => {
  try {
    const memberId = req.userId;

    const summary = await db.Savings.findAll({
      where: {
        member_id: memberId,
        status: 'COMPLETED'
      },
      attributes: [
        'savings_type',
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total_amount'],
        [db.sequelize.fn('COUNT', db.sequelize.col('savings_id')), 'transaction_count']
      ],
      group: ['savings_type']
    });

    return res.status(200).json({
      status: true,
      message: "Ringkasan simpanan berhasil diambil",
      data: summary
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message || "Terjadi kesalahan sistem."
    });
  }
};

export {
  createSavingsApplication,
  getSavingsHistory,
  getSavingsDetail,
  getSavingsOptions,
  getSavingsSummary
};
