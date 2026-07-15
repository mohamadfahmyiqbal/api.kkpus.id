import db from "../../../models/index.js";

const { Account, BillItem, FinancingApplication, Sequelize, Savings, MemberSavingsAccount, MemberSavingTarget, SavingTarget, SukukOrder, LoanProduct } = db;
const Op = Sequelize.Op;

export const getFinancialSummary = async (req, res) => {
  try {
    const memberId = req.userId;

    // Get valid loan product names to distinguish Jual Beli from Pinjaman/Program
    const loanProducts = await LoanProduct.findAll({ attributes: ['product_name'] });
    const loanProductNames = loanProducts.map(p => p.product_name) || [];

    // 1. Simpanan & Tabungan Reguler from Accounts (Main Ledger)
    const savingsAccounts = await Account.findAll({
      where: {
        member_id: memberId,
        account_type: {
          [Op.or]: [
            "SW_POKOK", "SW_WAJIB", "SS_SUKARELA", "TABUNGAN_DEPOSIT",
            { [Op.like]: 'TABUNGAN_%' }
          ]
        }
      },
    });

    let simpanan_pokok = 0;
    let simpanan_wajib = 0;
    let simpanan_sukarela = 0;
    let tabungan_reguler = 0;
    const tabungan_details_map = {};

    savingsAccounts.forEach(acc => {
      const balance = parseFloat(acc.current_balance || 0);
      if (acc.account_type === "SW_POKOK") simpanan_pokok = balance;
      else if (acc.account_type === "SW_WAJIB") simpanan_wajib = balance;
      else if (acc.account_type === "SS_SUKARELA") simpanan_sukarela = balance;
      else if (acc.account_type === "TABUNGAN_DEPOSIT") tabungan_reguler = balance;
      else if (acc.account_type.startsWith("TABUNGAN_")) {
        const type = acc.account_type.replace("TABUNGAN_", "").toLowerCase();
        tabungan_details_map[type] = (tabungan_details_map[type] || 0) + balance;
      }
    });

    // 2. Add Simpanan from Savings table
    const completedSavings = await Savings.findAll({
      where: { member_id: memberId, status: "COMPLETED" }
    });
    completedSavings.forEach(s => {
      const amt = parseFloat(s.amount || 0);
      if (s.savings_type === 'POKOK' && simpanan_pokok === 0) simpanan_pokok += amt;
      else if (s.savings_type === 'WAJIB' && simpanan_wajib === 0) simpanan_wajib += amt;
      else if (s.savings_type === 'SUKARELA' && simpanan_sukarela === 0) simpanan_sukarela += amt;
    });

    // 3. Tabungan from MemberSavingsAccount
    const msAccounts = await MemberSavingsAccount.findAll({
      where: { member_id: memberId }
    });
    msAccounts.forEach(msa => {
      const balance = parseFloat(msa.current_balance || 0);
      if (balance > 0) {
        const type = (msa.account_type || "Tabungan").toLowerCase();
        if (["simpanan pokok", "simpanan wajib", "simpanan sukarela"].includes(type)) return;
        tabungan_details_map[type] = (tabungan_details_map[type] || 0) + balance;
      }
    });

    // 4. Tabungan Targets
    const memberSavingTargets = await MemberSavingTarget.findAll({
      where: { 
        member_id: memberId,
        [Op.or]: [
          { status: "APPROVED" },
          { current_balance: { [Op.gt]: 0 } }
        ]
      },
      include: [{ model: SavingTarget, as: "savingTarget" }]
    });

    memberSavingTargets.forEach(mst => {
      const balance = parseFloat(mst.current_balance || 0);
      const name = (mst.savingTarget ? mst.savingTarget.target_name : "Tabungan").toLowerCase();
      tabungan_details_map[name] = (tabungan_details_map[name] || 0) + balance;
    });

    // 5. Financing Applications
    const financingApps = await FinancingApplication.findAll({
      where: { 
        member_id: memberId, 
        status: { [Op.in]: ['APPROVED', 'ACTIVE'] } 
      }
    });

    let jual_beli_total = 0;
    const jualBeliApps = [];
    let pinjaman_total_tagihan = 0;
    let pinjaman_nominal_kredit = 0;
    let pinjaman_nominal_cicilan = 0;
    let arisan_total_tagihan = 0;
    let arisan_diikuti_count = 0;
    let total_pendanaan_syariah = 0;

    financingApps.forEach(f => {
      const category = (f.category || '').toLowerCase();
      
      const isPinjaman = loanProductNames.some(p => p.toLowerCase() === category);
      const isArisan = category === 'arisan';
      const isPelunasan = category.includes('pelunasan');
      
      if (isPinjaman) {
        if (!isPelunasan) {
          const tagihan = parseFloat(f.total_tagihan || 0);
          const fallbackTagihan = parseFloat(f.amount_requested || 0) + parseFloat(f.margin_amount || 0);
          pinjaman_total_tagihan += tagihan > 0 ? tagihan : fallbackTagihan;
          pinjaman_nominal_kredit += parseFloat(f.amount_requested || 0);
        }
        pinjaman_nominal_cicilan += parseFloat(f.monthly_installment || 0);
      } else if (isArisan) {
        arisan_total_tagihan += parseFloat(f.total_tagihan || f.amount_requested || 0);
        arisan_diikuti_count++;
      } else if (category === 'pendanaan syariah umkm') {
        if (!isPelunasan) {
          const tagihanJB = parseFloat(f.total_tagihan || 0);
          const fallbackJB = parseFloat(f.amount_requested || 0) + parseFloat(f.margin_amount || 0);
          total_pendanaan_syariah += (tagihanJB > 0 ? tagihanJB : fallbackJB) + parseFloat(f.down_payment || 0);
        }
      } else {
        if (!isPelunasan) {
          const tagihanJB = parseFloat(f.total_tagihan || 0);
          const fallbackJB = parseFloat(f.amount_requested || 0) + parseFloat(f.margin_amount || 0);
          jual_beli_total += (tagihanJB > 0 ? tagihanJB : fallbackJB) + parseFloat(f.down_payment || 0);
        }
        jualBeliApps.push(f);
      }
    });

    // 6. Bill Items
    const allInstallments = await BillItem.findAll({
      where: {
        member_id: memberId,
        category_code: {
          [Op.in]: ['TRANSACTION_INSTALLMENT', 'TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN']
        }
      },
      include: [
        {
          model: FinancingApplication,
          as: 'financingApplication',
          required: true,
          where: {
            status: { [Op.in]: ['APPROVED', 'ACTIVE'] }
          },
          attributes: ['financing_id', 'category']
        }
      ]
    });

    let jual_beli_sisa_cicilan = 0;
    let jual_beli_terbayar = 0;
    let jual_beli_belum_dibayar_count = 0;
    let pinjaman_sisa_cicilan = 0;
    let pinjaman_terbayar = 0;
    let arisan_sisa_cicilan = 0;
    let arisan_terbayar = 0;

    const appsWithDpBillItem = new Set();

    allInstallments.forEach(item => {
      const category = (item.financingApplication?.category || '').toLowerCase();
      const isPinjaman = loanProductNames.some(p => p.toLowerCase() === category);
      const isArisan = category === 'arisan';
      
      if (['TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN'].includes(item.category_code)) {
        const appId = item.financing_application_id || item.financingApplication?.financing_id;
        if (appId) appsWithDpBillItem.add(appId);
      }

      const amt = parseFloat(item.amount || 0);
      
      if (item.status === 'UNPAID') {
        if (isPinjaman) pinjaman_sisa_cicilan += amt;
        else if (isArisan) arisan_sisa_cicilan += amt;
        else if (category === 'pendanaan syariah umkm') {
        } else {
          if (!category.includes('pelunasan')) {
            jual_beli_sisa_cicilan += amt;
            jual_beli_belum_dibayar_count++;
          }
        }
      } else if (item.status === 'PAID') {
        if (isPinjaman) pinjaman_terbayar += amt;
        else if (isArisan) arisan_terbayar += amt;
        else if (category === 'pendanaan syariah umkm') {
        } else jual_beli_terbayar += amt;
      }
    });

    jualBeliApps.forEach(f => {
      if (!appsWithDpBillItem.has(f.financing_id) && parseFloat(f.down_payment || 0) > 0) {
        jual_beli_terbayar += parseFloat(f.down_payment);
      }
    });

    // 7. Investasi from SukukOrder
    const activeInvestments = await SukukOrder.findAll({
      where: { 
        member_id: memberId,
        status: { [Op.notIn]: ['REJECTED', 'CANCELLED'] }
      }
    });
    let total_investasi = 0;
    activeInvestments.forEach(inv => {
      total_investasi += parseFloat(inv.amount || 0);
    });

    const details = [
      { type: "SW_POKOK", name: "Simpanan Pokok", balance: simpanan_pokok },
      { type: "SW_WAJIB", name: "Simpanan Wajib", balance: simpanan_wajib },
      { type: "SS_SUKARELA", name: "Simpanan Sukarela", balance: simpanan_sukarela },
      { type: "TABUNGAN_DEPOSIT", name: "Tabungan Reguler", balance: tabungan_reguler }
    ];

    Object.entries(tabungan_details_map).forEach(([name, balance]) => {
      details.push({
        type: `TABUNGAN_EXT_${name}`,
        name: name.charAt(0).toUpperCase() + name.slice(1),
        balance: balance
      });
    });

    const totalSavings = simpanan_pokok + simpanan_wajib + simpanan_sukarela;

    return res.status(200).json({
      success: true,
      message: "Data ringkasan keuangan berhasil dihitung secara manual",
      data: {
        totalSavings: totalSavings,
        totalLoanDebt: pinjaman_total_tagihan,
        totalSHU: 0,
        totalJualBeli: jual_beli_total,
        sisaCicilanJualBeli: jual_beli_sisa_cicilan,
        jumlahCicilanBelumDibayar: jual_beli_belum_dibayar_count,
        terbayarJualBeli: jual_beli_terbayar,
        totalNominalPinjaman: pinjaman_nominal_kredit,
        totalNominalCicilanPinjaman: pinjaman_nominal_cicilan,
        sisaCicilanPinjaman: pinjaman_sisa_cicilan,
        terbayarPinjaman: pinjaman_terbayar,
        totalArisanTagihan: arisan_total_tagihan,
        arisanDiikutiCount: arisan_diikuti_count,
        sisaCicilanArisan: arisan_sisa_cicilan,
        terbayarArisan: arisan_terbayar,
        totalInvestasi: total_investasi,
        totalPendanaanSyariah: total_pendanaan_syariah,
        details: details
      },
    });

  } catch (error) {
    console.error("Financial Summary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menghitung ringkasan keuangan.",
      error: error.message,
    });
  }
};
