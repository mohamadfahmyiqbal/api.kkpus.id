import db from "../models/index.js";

/**
 * Synchronize Jual Beli report for a specific member.
 * Recalculates aggregates for all years and upserts into jual_beli_reports table.
 * 
 * @param {object} sequelize 
 * @param {string} member_id 
 */
export const syncJualBeliReport = async (sequelize, member_id) => {
  if (!member_id) return;

  const FinancingApplication = db.FinancingApplication;
  const BillItem = db.BillItem;
  const JualBeliReport = db.JualBeliReport;
  const LoanProduct = db.LoanProduct;
  const Op = db.Sequelize.Op;

  try {
    // Get valid loan product names to distinguish Jual Beli from Pinjaman/Program
    const loanProducts = await LoanProduct.findAll({ attributes: ['product_name'] });
    const loanProductNames = loanProducts.map(p => p.product_name) || [];

    // 1. Fetch all Jual Beli applications for this member
    // Jual Beli is defined as applications with category NOT IN loanProductNames and NOT 'Arisan'
    const history = await FinancingApplication.findAll({
      where: {
        member_id: member_id,
        category: {
          [Op.and]: [
            { [Op.notIn]: [...loanProductNames, 'Arisan', 'Pelunasan Jual Beli'] },
            { [Op.notLike]: '%pelunasan%' }
          ]
        },
        status: { [Op.in]: ['APPROVED', 'COMPLETED', 'ACTIVE', 'LUNAS'] }
      },
      order: [['created_at', 'DESC']]
    });

    if (history.length === 0) {
      console.log(`No Jual Beli history found for member ${member_id}`);
      return;
    }

    // 2. Fetch all PAID BillItems for this member (DP and Installments)
    const paidItems = await BillItem.findAll({
      where: {
        member_id: member_id,
        category_code: {
          [Op.in]: ['TRANSACTION_INSTALLMENT', 'TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN']
        },
        status: 'PAID'
      }
    });

    // 3. Aggregate by Year
    const aggregates = {};
    
    // Group paid items by application id for efficient lookup
    const itemsByApp = {};
    paidItems.forEach(item => {
      const appId = item.financing_application_id;
      if (appId) {
        if (!itemsByApp[appId]) itemsByApp[appId] = [];
        itemsByApp[appId].push(item);
      }
    });

    history.forEach((h) => {
      const year = new Date(h.created_at).getFullYear();
      if (!aggregates[year]) {
        aggregates[year] = { pokok: 0, margin: 0, dp: 0, cicilan: 0 };
      }

      const pokok = parseFloat(h.item_price || h.amount_requested || 0) + parseFloat(h.operational_cost || 0);
      const margin = parseFloat(h.margin_amount || 0);
      const dp = parseFloat(h.down_payment || 0);
      
      // Find items belonging specifically to this application
      const appPaidItems = itemsByApp[h.financing_id] || [];

      const totalPaidForApp = appPaidItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
      const hasPaidDPInApp = appPaidItems.some(item => ['TRANSACTION_DOWN_PAYMENT', 'DP_PEMBIAYAAN'].includes(item.category_code));

      // Calculate paid cicilan for this app
      // Fallback: If DP wasn't in bill items but app is approved/active/completed, we assume DP was paid separately
      const effectivePaidAmount = totalPaidForApp + (!hasPaidDPInApp && dp > 0 ? dp : 0);
      const cicilan = Math.max(0, effectivePaidAmount - dp);

      aggregates[year].pokok += pokok;
      aggregates[year].margin += margin;
      aggregates[year].dp += dp;
      aggregates[year].cicilan += cicilan;
    });

    // 4. Upsert into jual_beli_reports
    const years = Object.keys(aggregates);
    for (const year of years) {
      const data = aggregates[year];
      await JualBeliReport.upsert({
        member_id: member_id,
        year: parseInt(year),
        total_pokok: data.pokok,
        total_margin: data.margin,
        total_dp: data.dp,
        total_cicilan: data.cicilan
      });
    }

    console.log(`Successfully synced Jual Beli report for member ${member_id}`);
  } catch (error) {
    console.error(`Failed to sync Jual Beli report for member ${member_id}:`, error.message);
  }
};
