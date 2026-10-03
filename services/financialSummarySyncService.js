import { syncSavingsReportList } from "./savingsReportSyncService.js";

/**
 * Synchronize financial summary for a specific member.
 * Aggregates all financial data (Simpanan, Jual Beli, Pinjaman, Arisan, Tabungan) 
 * and upserts into member_financial_summaries table.
 * 
 * @param {object} sequelize 
 * @param {string} memberId 
 */
export const syncFinancialSummary = async (sequelize, memberId) => {
  if (!memberId) return;

  const Account = sequelize.models.accounts;
  const MemberSavingTarget = sequelize.models.member_saving_targets;
  const SavingTarget = sequelize.models.saving_targets;
  const FinancingApplication = sequelize.models.financing_applications;
  const BillItem = sequelize.models.bill_items;
  const MemberFinancialSummary = sequelize.models.MemberFinancialSummary;
  const Savings = sequelize.models.Savings;
  const MemberSavingsAccount = sequelize.models.member_savings_accounts;
  const SukukOrder = sequelize.models.sukuk_orders;
  const LoanProduct = sequelize.models.loan_products;
  const Op = sequelize.Sequelize.Op;

  try {
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

    // 2. Add Simpanan from Savings table (For records not yet in Account ledger)
    const completedSavings = await Savings.findAll({
      where: { member_id: memberId, status: "COMPLETED" }
    });
    
    // We only add from Savings table if the Account ledger for that type is 0
    // or if we consider them separate records. Based on getDashboard.js, 
    // Savings table is often the primary source for some implementations.
    completedSavings.forEach(s => {
      const amt = parseFloat(s.amount || 0);
      if (s.savings_type === 'POKOK' && simpanan_pokok === 0) simpanan_pokok += amt;
      else if (s.savings_type === 'WAJIB' && simpanan_wajib === 0) simpanan_wajib += amt;
      else if (s.savings_type === 'SUKARELA' && simpanan_sukarela === 0) simpanan_sukarela += amt;
    });

    // 3. Tabungan from MemberSavingsAccount (Product-based savings)
    const msAccounts = await MemberSavingsAccount.findAll({
      where: { member_id: memberId }
    });
    msAccounts.forEach(msa => {
      const balance = parseFloat(msa.current_balance || 0);
      if (balance > 0) {
        const type = (msa.account_type || "Tabungan").toLowerCase();
        // Skip main simpanan types to avoid double counting in tabungan_details
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

    // 5. Financing Applications (Jual Beli, Pinjaman, Arisan) - Only Active ones
    const financingApps = await FinancingApplication.findAll({
      where: { 
        member_id: memberId, 
        status: { [Op.in]: ['APPROVED', 'ACTIVE'] } // Exclude COMPLETED, CANCELLED, REJECTED
      }
    });

    let jual_beli_total = 0;
    const jualBeliApps = [];
    let pinjaman_total_tagihan = 0;
    let pinjaman_nominal_kredit = 0;
    let pinjaman_nominal_cicilan = 0;
    let arisan_total_tagihan = 0;
    let arisan_diikuti_count = 0;

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
          // Accumulate to a local variable for pendanaan, we will add it to total_investasi later
          const pendanaanTotal = (tagihanJB > 0 ? tagihanJB : fallbackJB) + parseFloat(f.down_payment || 0);
          // In this context, we will add it to a tracking variable.
          f._pendanaan_amount = pendanaanTotal;
        }
      } else {
        // Everything else is Jual Beli
        // Exclude Pelunasan from total debt to avoid double counting
        if (!isPelunasan) {
          const tagihanJB = parseFloat(f.total_tagihan || 0);
          const fallbackJB = parseFloat(f.amount_requested || 0) + parseFloat(f.margin_amount || 0);
          jual_beli_total += (tagihanJB > 0 ? tagihanJB : fallbackJB) + parseFloat(f.down_payment || 0);
        }
        jualBeliApps.push(f);
      }
    });

    // 6. Bill Items (Paid vs Unpaid for ACTIVE financing only)
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
          required: true, // Only items that belong to an application
          where: {
            status: { [Op.in]: ['APPROVED', 'ACTIVE'] } // Only items from active financing
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
          // Exclude from Jual Beli unpaid count/balance
        } else {
          // Exclude Pelunasan bill items from debt count to avoid doubling
          if (!category.includes('pelunasan')) {
            jual_beli_sisa_cicilan += amt;
            jual_beli_belum_dibayar_count++;
          }
        }
      } else if (item.status === 'PAID') {
        if (isPinjaman) pinjaman_terbayar += amt;
        else if (isArisan) arisan_terbayar += amt;
        else if (category === 'pendanaan syariah umkm') {
          // Ignore for Jual Beli terbayar
        } else jual_beli_terbayar += amt;
      }
    });

    // Fallback for DP not in BillItems for Jual Beli
    // If the app is APPROVED/ACTIVE/COMPLETED and no DP bill item found, count DP as paid
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

    // Add Pendanaan Syariah to total_pendanaan_syariah
    let total_pendanaan_syariah = 0;
    financingApps.forEach(f => {
      if ((f.category || '').toLowerCase() === 'pendanaan syariah umkm') {
        if (f._pendanaan_amount) {
           total_pendanaan_syariah += f._pendanaan_amount;
        }
      }
    });

    console.log("DEBUG BEFORE UPSERT:", {
      member_id: memberId,
      pinjaman_total_tagihan,
      pinjaman_nominal_kredit,
      jual_beli_total,
    });

    // 8. Upsert into member_financial_summaries
    await MemberFinancialSummary.upsert({
      member_id: memberId,
      simpanan_pokok,
      simpanan_wajib,
      simpanan_sukarela,
      tabungan_reguler,
      tabungan_details: tabungan_details_map,
      jual_beli_total,
      jual_beli_sisa_cicilan,
      jual_beli_terbayar,
      jual_beli_belum_dibayar_count,
      pinjaman_total_tagihan,
      pinjaman_nominal_kredit,
      pinjaman_nominal_cicilan,
      pinjaman_sisa_cicilan,
      pinjaman_terbayar,
      arisan_total_tagihan,
      arisan_sisa_cicilan,
      arisan_terbayar,
      arisan_diikuti_count,
      total_investasi,
      total_pendanaan_syariah
    });

    console.log(`Successfully synced financial summary for member ${memberId}`);

    // Call the savings report list sync as well for this specific member
    await syncSavingsReportList(sequelize, memberId);

  } catch (error) {
    console.error(`Failed to sync financial summary for member ${memberId}:`, error.message);
  }
};
