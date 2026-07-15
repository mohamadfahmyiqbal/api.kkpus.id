import db from "../../models/index.js";

const getFinancingHistory = async (req, res) => {
  try {
    // Sekarang req.user sudah terisi oleh middleware
    const member_id = req?.userId;

    if (!member_id) {
      return res.status(401).json({
        status: false,
        message: "Sesi tidak valid, member_id tidak ditemukan dalam request"
      });
    }

    const { type, all, batch_id } = req.query; // 'jualbeli' or 'pinjaman'

    const whereClause = {};
    if (String(all) !== 'true') {
      whereClause.member_id = member_id;
    }

    if (type === 'pinjaman') {
      whereClause.purpose = { [db.Sequelize.Op.like]: 'Pinjaman%' };
    } else if (type === 'arisan') {
      whereClause.purpose = { [db.Sequelize.Op.like]: 'Arisan%' };
    } else if (type === 'pendanaan') {
      whereClause.category = 'Pendanaan Syariah UMKM';
    } else if (type === 'jualbeli') {
      whereClause.purpose = { 
        [db.Sequelize.Op.and]: [
          { [db.Sequelize.Op.notLike]: 'Pinjaman%' },
          { [db.Sequelize.Op.notLike]: 'Arisan%' }
        ]
      };
      whereClause.category = {
        [db.Sequelize.Op.and]: [
          { [db.Sequelize.Op.ne]: 'Pendanaan Syariah UMKM' }
        ]
      };
    }

    if (batch_id) {
      whereClause.arisan_batch_id = batch_id;
    }

    const history = await db.FinancingApplication.findAll({
      where: whereClause,
      include: [
        {
          model: db.Member,
          as: 'member',
          attributes: ['full_name', 'member_id']
        },
        {
          model: db.Approval,
          as: 'approvals',
          attributes: ['note', 'decision', 'created_at']
        }
      ],
      limit: 50,
      order: [['created_at', 'DESC']]
    });

    const memberIds = [...new Set(history.map(h => h.member_id))];

    const paidInstallments = await db.BillItem.findAll({
      where: {
        member_id: { [db.Sequelize.Op.in]: memberIds },
        category_code: {
          [db.Sequelize.Op.in]: ['TRANSACTION_INSTALLMENT', 'TRANSACTION_DOWN_PAYMENT']
        },
        status: 'PAID'
      }
    });

    const paidByApp = {};
    paidInstallments.forEach(item => {
      const appId = item.financing_application_id;
      if (!appId) return; // Skip if no app id
      if (!paidByApp[appId]) {
        paidByApp[appId] = { total: 0, items: [], installment_amount: 0, installment_count: 0 };
      }
      paidByApp[appId].total += parseFloat(item.amount || 0);
      paidByApp[appId].items.push(item);
      if (item.category_code === 'TRANSACTION_INSTALLMENT') {
        paidByApp[appId].installment_amount += parseFloat(item.amount || 0);
        paidByApp[appId].installment_count += 1;
      }
    });

    const unpaidInstallments = await db.BillItem.findAll({
      where: {
        member_id: { [db.Sequelize.Op.in]: memberIds },
        category_code: 'TRANSACTION_INSTALLMENT',
        status: 'UNPAID'
      }
    });

    const unpaidByApp = {};
    unpaidInstallments.forEach(item => {
      const appId = item.financing_application_id;
      if (!appId) return;
      if (!unpaidByApp[appId]) {
        unpaidByApp[appId] = { total: 0, count: 0, items: [] };
      }
      unpaidByApp[appId].total += parseFloat(item.amount || 0);
      unpaidByApp[appId].count += 1;
      unpaidByApp[appId].items.push(item);
    });

    const result = history.map((h) => {
      const data = h.toJSON ? h.toJSON() : h;
      if (data.member) {
        data.member_name = data.member.full_name;
        if (!data.user_id) data.user_id = data.member.member_id;
      }
      
      const appPayments = paidByApp[data.financing_id] || { total: 0, items: [], installment_amount: 0, installment_count: 0 };
      const appUnpaid = unpaidByApp[data.financing_id] || { total: 0, count: 0, items: [] };
      const hasPaidDP = appPayments.items.some(item => item.category_code === 'TRANSACTION_DOWN_PAYMENT' || item.category_code === 'DP_PEMBIAYAAN');
      
      const expectedTotalInstallment = (parseFloat(data.item_price || data.amount_requested || 0) - parseFloat(data.down_payment || 0));
      let calculatedUnpaid = appUnpaid.total;
      let calculatedUnpaidCount = appUnpaid.count;

      if (appPayments.installment_amount >= expectedTotalInstallment && expectedTotalInstallment > 0) {
        calculatedUnpaid = 0;
        calculatedUnpaidCount = 0;
      }

      data.paid_amount = appPayments.total + (!hasPaidDP ? parseFloat(data.down_payment || 0) : 0);
      data.unpaid_amount = calculatedUnpaid;
      data.unpaid_term_count = calculatedUnpaidCount;
      data.paid_term_count = appPayments.installment_count;
      data.paid_installment_amount = appPayments.installment_amount;
      
      if (data.unpaid_term_count === 0 && data.paid_term_count > 0 && (data.status === 'APPROVED' || data.status === 'COMPLETED' || data.status === 'ACTIVE')) {
        data.status = 'PAID';
      }

      return data;
    });

    res.status(200).json({ status: true, data: result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export default getFinancingHistory;