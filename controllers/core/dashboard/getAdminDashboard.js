import db from "../../../models/index.js";
import { Op } from "sequelize";

export const getAdminDashboard = async (req, res) => {
  try {
    // 1. STATS

    // Get valid loan product names to distinguish Program from Jual Beli
    const loanProducts = await db.LoanProduct.findAll({ attributes: ['product_name'] });
    const loanProductNames = loanProducts.map(p => p.product_name) || [];

    // Total Anggota (ACTIVE)
    const finalTotalAnggota = await db.Member.count();

    // Total Simpanan (Pokok, Wajib, Sukarela)
    const totalSimpanan = await db.Account.sum('current_balance', {
      where: { 
        account_type: { [Op.in]: ['SAVINGS', 'SW_POKOK', 'SW_WAJIB', 'SS_SUKARELA'] } 
      }
    });

    // Total Jual Beli (From FinancingApplication not in loanProductNames)
    let totalJualBeli = 0;
    if (loanProductNames.length > 0) {
      totalJualBeli = await db.FinancingApplication.sum('amount_requested', {
        where: { 
          status: { [Op.in]: ['ACTIVE', 'APPROVED', 'COMPLETED'] },
          category: { [Op.notIn]: loanProductNames }
        }
      });
    } else {
      totalJualBeli = await db.FinancingApplication.sum('amount_requested', {
        where: { status: { [Op.in]: ['ACTIVE', 'APPROVED', 'COMPLETED'] } }
      });
    }

    // Total Program (Pembiayaan) (From FinancingApplication in loanProductNames)
    let totalProgram = 0;
    if (loanProductNames.length > 0) {
      totalProgram = await db.FinancingApplication.sum('amount_requested', {
        where: { 
          status: { [Op.in]: ['ACTIVE', 'APPROVED', 'COMPLETED'] },
          category: { [Op.in]: loanProductNames }
        }
      });
    }

    // Total Tabungan (Mudharabah)
    const totalTabungan = await db.Account.sum('current_balance', {
      where: { account_type: 'TABUNGAN_DEPOSIT' }
    });

    // Total Investasi (Sukuk)
    const totalInvestasi = await db.Account.sum('current_balance', {
      where: { account_type: 'SUKUK_INVESTMENT' }
    });

    // Format Rupiah
    const formatRp = (amount) => {
      if (!amount || amount === 0) return 'Rp 0';
      const val = parseFloat(amount);
      return `Rp ${val.toLocaleString('id-ID')}`;
    };

    const stats = [
      { title: 'Total Anggota', value: finalTotalAnggota.toString(), icon: 'Users', color: 'primary', trend: 'Anggota' },
      { title: 'Total Simpanan', value: formatRp(totalSimpanan || 0), icon: 'Wallet', color: 'success', trend: 'Simpanan' },
      { title: 'Total Jual Beli', value: formatRp(totalJualBeli || 0), icon: 'ShoppingCart', color: 'info', trend: 'Jual Beli' },
      { title: 'Total Program', value: formatRp(totalProgram || 0), icon: 'Heart', color: 'danger', trend: 'Program' },
      { title: 'Total Tabungan', value: formatRp(totalTabungan || 0), icon: 'Bank', color: 'warning', trend: 'Tabungan' },
      { title: 'Total Investasi', value: formatRp(totalInvestasi || 0), icon: 'TrendUp', color: 'dark', trend: 'Investasi' },
    ];

    // 2. PENDING TRANSACTIONS (Categorized Approvals)

    // A. Simpanan (Pencairan)
    const pendingWithdrawals = await db.SavingsWithdrawal.findAll({
      where: { status: 'PENDING' },
      include: [
        { model: db.MemberSavingsAccount, as: 'savingsAccount', include: [{ model: db.Member, as: 'member' }] },
        { 
          model: db.ApprovalFlow, 
          as: 'flow', 
          include: [{ 
            model: db.ApprovalStep, 
            as: 'steps', 
            include: [{ model: db.UserRole, as: 'verifierRole' }] 
          }] 
        },
        { 
          model: db.ApprovalStep, 
          as: 'currentStep',
          include: [{ model: db.UserRole, as: 'verifierRole' }]
        }
      ],
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    // B. Jual Beli
    let pendingJualBeli = [];
    if (loanProductNames.length > 0) {
      pendingJualBeli = await db.FinancingApplication.findAll({
        where: { 
          status: 'PENDING',
          category: { [Op.notIn]: loanProductNames }
        },
        include: [
          { model: db.Member, as: 'member', attributes: ['full_name'] },
          { model: db.ApprovalFlow, as: 'flow', include: [{ model: db.ApprovalStep, as: 'steps', include: [{ model: db.UserRole, as: 'verifierRole' }] }] },
          { model: db.ApprovalStep, as: 'currentStep', include: [{ model: db.UserRole, as: 'verifierRole' }] }
        ],
        limit: 10,
        order: [['created_at', 'DESC']]
      });
    } else {
      pendingJualBeli = await db.FinancingApplication.findAll({
        where: { status: 'PENDING' },
        include: [
          { model: db.Member, as: 'member', attributes: ['full_name'] },
          { model: db.ApprovalFlow, as: 'flow', include: [{ model: db.ApprovalStep, as: 'steps', include: [{ model: db.UserRole, as: 'verifierRole' }] }] },
          { model: db.ApprovalStep, as: 'currentStep', include: [{ model: db.UserRole, as: 'verifierRole' }] }
        ],
        limit: 10,
        order: [['created_at', 'DESC']]
      });
    }

    // C. Program (Pembiayaan)
    let pendingFinancings = [];
    if (loanProductNames.length > 0) {
      pendingFinancings = await db.FinancingApplication.findAll({
        where: { 
          status: 'PENDING',
          category: { [Op.in]: loanProductNames }
        },
        include: [{ model: db.Member, as: 'member', attributes: ['full_name'] }],
        limit: 10,
        order: [['created_at', 'DESC']]
      });
    }

    // D. Tabungan
    const pendingTabungan = await db.MemberSavingTarget.findAll({
      where: { status: 'PENDING' },
      include: [{ model: db.Member, as: 'member', attributes: ['full_name'] }, { model: db.SavingTarget, as: 'savingTarget' }],
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    // E. Investasi
    const pendingInvestasi = await db.SukukOrder.findAll({
      where: { status: 'PENDING' },
      include: [{ model: db.Member, as: 'member', attributes: ['full_name'] }, { model: db.SukukIssue, as: 'sukukIssue' }],
      limit: 10,
      order: [['createdAt', 'DESC']]
    });

    const pendingCategorized = {
      simpanan: pendingWithdrawals.map(w => ({
        id: w.withdrawal_id,
        name: w.savingsAccount?.member?.full_name || 'Unknown',
        item: 'Pencairan Simpanan',
        amount: formatRp(w.amount),
        date: w.created_at,
        flow: w.flow,
        currentStep: w.currentStep,
        final_status: w.status
      })),
      jualBeli: pendingJualBeli.map(j => ({
        id: j.financing_id,
        name: j.member?.full_name || 'Unknown',
        item: `Jual Beli ${j.category || ''}`,
        amount: formatRp(j.item_price || j.amount_requested),
        date: j.createdAt || j.created_at,
        flow: j.flow,
        currentStep: j.currentStep,
        final_status: j.status,
        principal_amount: j.amount_requested,
        down_payment: j.down_payment || 0,
        tenure: j.cooperation_months || 0,
        monthly_installment: j.monthly_installment || 0
      })),
      program: pendingFinancings.map(f => ({
        id: f.financing_id,
        name: f.member?.full_name || 'Unknown',
        item: `Pembiayaan ${f.category || 'Baru'}`,
        amount: formatRp(f.amount_requested),
        date: f.createdAt || f.created_at
      })),
      tabungan: pendingTabungan.map(t => ({
        id: t.member_saving_target_id,
        name: t.member?.full_name || 'Unknown',
        item: t.savingTarget?.name || 'Target Tabungan',
        amount: formatRp(t.target_amount),
        date: t.createdAt || t.created_at
      })),
      investasi: pendingInvestasi.map(i => ({
        id: i.order_id,
        name: i.member?.full_name || 'Unknown',
        item: i.sukukIssue?.name || 'Investasi Sukuk',
        amount: formatRp(i.amount),
        date: i.createdAt || i.created_at
      }))
    };

    // 3. RECENT NOTIFICATIONS
    const recentNotifications = await db.Notification.findAll({
      limit: 3,
      order: [['sent_datetime', 'DESC']]
    });

    const notifications = recentNotifications.length > 0 ? recentNotifications.map((n, idx) => ({
      id: n.notification_id || idx,
      title: n.title,
      body: n.content,
      type: n.type?.toLowerCase() === 'error' ? 'danger' : (n.type?.toLowerCase() || 'info'),
      time: n.sent_datetime
    })) : [
      { id: 1, title: 'Sistem Backup Berhasil', body: 'Database telah di-backup otomatis.', type: 'info', time: new Date() }
    ];

    return res.status(200).json({
      success: true,
      data: {
        stats,
        pendingCategorized,
        notifications
      }
    });

  } catch (error) {
    console.error("Error in getAdminDashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat mengambil data dashboard.",
      error: error.message
    });
  }
};
