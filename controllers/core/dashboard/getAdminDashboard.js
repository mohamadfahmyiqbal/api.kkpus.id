import db from "../../../models/index.js";
import { Op } from "sequelize";

export const getAdminDashboard = async (req, res) => {
  try {
    // 1. STATS

    // Get valid loan product names to distinguish Program from Jual Beli
    const loanProducts = await db.LoanProduct.findAll({ attributes: ['product_name'] });
    const programCategories = loanProducts.map(p => p.product_name) || [];
    programCategories.push('Arisan');

    // Total Anggota (ACTIVE)
    const finalTotalAnggota = await db.Member.count();

    // Total Simpanan (Pokok, Wajib, Sukarela)
    const totalSimpanan = await db.Account.sum('current_balance', {
      where: { 
        account_type: { [Op.in]: ['SAVINGS', 'SW_POKOK', 'SW_WAJIB', 'SS_SUKARELA'] } 
      }
    });

    // Total Jual Beli (From FinancingApplication not in programCategories)
    let totalJualBeli = 0;
    if (programCategories.length > 0) {
      totalJualBeli = await db.FinancingApplication.sum('amount_requested', {
        where: { 
          status: { [Op.in]: ['ACTIVE', 'APPROVED', 'COMPLETED'] },
          category: { [Op.notIn]: programCategories }
        }
      });
    } else {
      totalJualBeli = await db.FinancingApplication.sum('amount_requested', {
        where: { status: { [Op.in]: ['ACTIVE', 'APPROVED', 'COMPLETED'] } }
      });
    }

    // Total Program (Pembiayaan) (From FinancingApplication in programCategories)
    let totalProgram = 0;
    if (programCategories.length > 0) {
      totalProgram = await db.FinancingApplication.sum('amount_requested', {
        where: { 
          status: { [Op.in]: ['ACTIVE', 'APPROVED', 'COMPLETED'] },
          category: { [Op.in]: programCategories }
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
      where: { 
        status: 'PENDING',
        member_saving_target_id: { [Op.is]: null }
      },
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
        },
        {
          model: db.Approval,
          as: 'approvals',
          required: false,
          include: [
            {
              model: db.ApprovalStep,
              as: "step",
              include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }]
            }
          ]
        }
      ],
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    // B. Jual Beli
    let pendingJualBeli = [];
    if (programCategories.length > 0) {
      pendingJualBeli = await db.FinancingApplication.findAll({
        where: { 
          status: 'PENDING',
          category: { [Op.notIn]: [...programCategories, 'Pendanaan Syariah UMKM'] }
        },
        include: [
          { model: db.Member, as: 'member', attributes: ['full_name'] },
          { model: db.ApprovalFlow, as: 'flow', include: [{ model: db.ApprovalStep, as: 'steps', include: [{ model: db.UserRole, as: 'verifierRole' }] }] },
          { model: db.ApprovalStep, as: 'currentStep', include: [{ model: db.UserRole, as: 'verifierRole' }] },
          { model: db.Approval, as: 'approvals', include: [{ model: db.ApprovalStep, as: 'step', include: [{ model: db.UserRole, as: 'verifierRole' }] }] }
        ],
        limit: 10,
        order: [['created_at', 'DESC']]
      });
    } else {
      pendingJualBeli = await db.FinancingApplication.findAll({
        where: { 
          status: 'PENDING',
          category: { [Op.ne]: 'Pendanaan Syariah UMKM' }
        },
        include: [
          { model: db.Member, as: 'member', attributes: ['full_name'] },
          { model: db.ApprovalFlow, as: 'flow', include: [{ model: db.ApprovalStep, as: 'steps', include: [{ model: db.UserRole, as: 'verifierRole' }] }] },
          { model: db.ApprovalStep, as: 'currentStep', include: [{ model: db.UserRole, as: 'verifierRole' }] },
          { model: db.Approval, as: 'approvals', include: [{ model: db.ApprovalStep, as: 'step', include: [{ model: db.UserRole, as: 'verifierRole' }] }] }
        ],
        limit: 10,
        order: [['created_at', 'DESC']]
      });
    }

    // C. Program (Pembiayaan)
    let pendingFinancings = [];
    if (programCategories.length > 0) {
      pendingFinancings = await db.FinancingApplication.findAll({
        where: { 
          status: 'PENDING',
          category: { [Op.in]: programCategories }
        },
        include: [
          { model: db.Member, as: 'member', attributes: ['full_name'] },
          { model: db.ApprovalFlow, as: 'flow', include: [{ model: db.ApprovalStep, as: 'steps', include: [{ model: db.UserRole, as: 'verifierRole' }] }] },
          { model: db.ApprovalStep, as: 'currentStep', include: [{ model: db.UserRole, as: 'verifierRole' }] },
          { model: db.Approval, as: 'approvals', include: [{ model: db.ApprovalStep, as: 'step', include: [{ model: db.UserRole, as: 'verifierRole' }] }] }
        ],
        limit: 10,
        order: [['created_at', 'DESC']]
      });
    }

    // Pendanaan Syariah (For Investasi Tab)
    const pendingPendanaanSyariah = await db.FinancingApplication.findAll({
      where: { 
        status: 'PENDING',
        category: 'Pendanaan Syariah UMKM'
      },
      include: [
        { model: db.Member, as: 'member', attributes: ['full_name'] },
        { model: db.ApprovalFlow, as: 'flow', include: [{ model: db.ApprovalStep, as: 'steps', include: [{ model: db.UserRole, as: 'verifierRole' }] }] },
        { model: db.ApprovalStep, as: 'currentStep', include: [{ model: db.UserRole, as: 'verifierRole' }] }
      ],
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    // D. Tabungan
    const pendingTabungan = await db.MemberSavingTarget.findAll({
      where: { status: 'PENDING' },
      include: [
        { model: db.Member, as: 'member', attributes: ['full_name'] }, 
        { model: db.SavingTarget, as: 'savingTarget' },
        { model: db.ApprovalFlow, as: 'flow', include: [{ model: db.ApprovalStep, as: 'steps', include: [{ model: db.UserRole, as: 'verifierRole' }] }] },
        { model: db.ApprovalStep, as: 'currentStep', include: [{ model: db.UserRole, as: 'verifierRole' }] },
        {
          model: db.Approval,
          as: 'approvals',
          required: false,
          include: [
            {
              model: db.ApprovalStep,
              as: "step",
              include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }]
            }
          ]
        }
      ],
      limit: 10,
      order: [['created_at', 'DESC']]
    });

    const pendingTabunganWithdrawals = await db.SavingsWithdrawal.findAll({
      where: { 
        status: 'PENDING',
        member_saving_target_id: { [Op.not]: null }
      },
      include: [
        { model: db.Member, as: 'member', attributes: ['full_name'] },
        { model: db.MemberSavingTarget, as: 'savingTarget' },
        { 
          model: db.ApprovalFlow, 
          as: 'flow', 
          include: [{ model: db.ApprovalStep, as: 'steps', include: [{ model: db.UserRole, as: 'verifierRole' }] }] 
        },
        { 
          model: db.ApprovalStep, 
          as: 'currentStep',
          include: [{ model: db.UserRole, as: 'verifierRole' }]
        },
        {
          model: db.Approval,
          as: 'approvals',
          required: false,
          include: [{ model: db.ApprovalStep, as: "step", include: [{ model: db.UserRole, as: "verifierRole", attributes: ["role_name"] }] }]
        }
      ],
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
        member_id: w.member_id,
        name: w.savingsAccount?.member?.full_name || 'Unknown',
        item: 'Pencairan Simpanan',
        amount: formatRp(w.amount),
        date: w.created_at,
        flow: w.flow,
        currentStep: w.currentStep,
        final_status: w.status,
        approvals: w.approvals?.map(a => typeof a.toJSON === 'function' ? a.toJSON() : a)
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
        monthly_installment: j.monthly_installment || 0,
        margin_amount: j.margin_amount || 0,
        total_tagihan: j.total_tagihan || 0,
        approvals: j.approvals
      })),
      program: pendingFinancings.map(f => ({
        id: f.financing_id,
        member_id: f.member_id,
        name: f.member?.full_name || 'Unknown',
        item: `Pembiayaan ${f.category || 'Baru'}`,
        amount: formatRp(f.amount_requested),
        date: f.createdAt || f.created_at,
        flow: f.flow,
        currentStep: f.currentStep,
        final_status: f.status,
        principal_amount: f.amount_requested,
        down_payment: f.down_payment || 0,
        tenure: f.cooperation_months || 0,
        monthly_installment: f.monthly_installment || 0,
        disbursement_method: f.metode_pencairan || f.disbursement_method || '-',
        bank_name: f.bank_tujuan || f.bank_name || '',
        bank_account_no: f.no_rekening || f.bank_account_no || '',
        approvals: f.approvals
      })),
      tabungan: [
        ...pendingTabungan.map(t => {
          const targetAmount = t.target_amount || t.savingTarget?.target_amount || 0;
          const termMonths = t.term_months || t.savingTarget?.term_months || 0;
          const minMonthlyDeposit = t.monthly_deposit || t.savingTarget?.min_monthly_deposit || 0;
          const category = t.savingTarget?.category || t.category || '';
          const itemName = t.savingTarget?.target_name || category || 'Target Tabungan';

          return {
            id: t.member_saving_target_id,
            member_id: t.member_id,
            name: t.member?.full_name || 'Unknown',
            item: itemName,
            amount: formatRp(targetAmount),
            date: t.createdAt || t.created_at,
            category: category,
            term_months: termMonths,
            min_monthly_deposit: minMonthlyDeposit,
            target_amount: targetAmount,
            flow: t.flow,
            currentStep: t.currentStep,
            final_status: t.status,
            approvals: t.approvals
          };
        }),
        ...pendingTabunganWithdrawals.map(w => ({
          id: w.withdrawal_id,
          member_id: w.member_id,
          name: w.member?.full_name || 'Unknown',
          item: 'Pencairan Tabungan',
          amount: formatRp(w.amount),
          date: w.created_at,
          flow: w.flow,
          currentStep: w.currentStep,
          final_status: w.status,
          approvals: w.approvals?.map(a => typeof a.toJSON === 'function' ? a.toJSON() : a)
        }))
      ],
      investasi: [
        ...pendingInvestasi.map(i => {
          // Construct a fake flow and current step based on SukukOrder's boolean fields
          const isPengawasDone = i.is_approved_pengawas;
          const isKetuaDone = i.is_approved_ketua;
          const isBendaharaDone = i.is_approved_bendahara;

          let currentStepOrder = 1;
          let currentStepName = "Persetujuan Pengawas";
          let currentRoleName = "Pengawas";

          if (isPengawasDone && !isKetuaDone) {
            currentStepOrder = 2;
            currentStepName = "Persetujuan Ketua";
            currentRoleName = "Ketua";
          } else if (isKetuaDone && !isBendaharaDone) {
            currentStepOrder = 3;
            currentStepName = "Persetujuan Bendahara";
            currentRoleName = "Bendahara";
          } else if (isBendaharaDone) {
            currentStepOrder = 4;
            currentStepName = "Selesai";
            currentRoleName = "Selesai";
          }

          const mockFlow = {
            steps: [
              { id: 1, step_order: 1, step_name: "Persetujuan Pengawas", verifierRole: { role_name: "Pengawas" } },
              { id: 2, step_order: 2, step_name: "Persetujuan Ketua", verifierRole: { role_name: "Ketua" } },
              { id: 3, step_order: 3, step_name: "Persetujuan Bendahara", verifierRole: { role_name: "Bendahara" } },
            ]
          };

          const mockCurrentStep = {
            step_order: currentStepOrder,
            step_name: currentStepName,
            verifierRole: { role_name: currentRoleName }
          };

          return {
            id: i.order_id,
            member_id: i.member_id,
            name: i.member?.full_name || 'Unknown',
            member_type: i.member?.member_type || 'Anggota Reguler',
            item: i.sukukIssue?.name || 'Investasi Sukuk',
            amount: formatRp(i.amount),
            date: i.createdAt || i.created_at,
            status: i.status,
            final_status: i.status,
            flow: mockFlow,
            currentStep: mockCurrentStep,
            sukuk_name: i.sukukIssue?.name || 'Sukuk Halal',
            sukuk_publisher: i.sukukIssue?.publisher || 'Pemerintah RI / Koperasi',
            sukuk_type: i.sukukIssue?.type || 'Sukuk Ritel',
            sukuk_yield: i.sukukIssue?.yield_percentage || 0,
            is_approved_pengawas: i.is_approved_pengawas,
            is_approved_ketua: i.is_approved_ketua,
            is_approved_bendahara: i.is_approved_bendahara
          };
        }),
        ...pendingPendanaanSyariah.map(p => ({
          id: p.financing_id,
          name: p.member?.full_name || 'Unknown',
          item: `Pendanaan Syariah`,
          amount: formatRp(p.amount_requested),
          date: p.createdAt || p.created_at,
          status: p.status,
          final_status: p.status,
          flow: p.flow,
          currentStep: p.currentStep,
          is_pendanaan: true,
          is_pendanaan: true,
          principal_amount: p.amount_requested,
          down_payment: p.down_payment || 0,
          tenure: p.cooperation_months || 0,
          monthly_installment: p.monthly_installment || 0,
          business_name: p.business_name || null,
          business_sector: p.business_sector || null,
          business_address: p.business_address || null,
          estimated_yearly_turnover: p.estimated_yearly_turnover || 0,
          estimated_monthly_turnover: p.estimated_monthly_turnover || 0,
          investor_profit_share: p.investor_profit_share || 0,
          file_evidence: p.file_evidence || null,
          contract_proof: p.contract_proof || null,
          additional_documents: p.additional_documents || null,
          purpose: p.purpose || null
        }))
      ]
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
