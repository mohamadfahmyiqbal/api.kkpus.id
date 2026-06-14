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

    const { type } = req.query; // 'jualbeli' or 'pinjaman'

    const whereClause = { member_id };

    if (type === 'pinjaman') {
      whereClause.purpose = { [db.Sequelize.Op.like]: 'Pinjaman%' };
    } else if (type === 'jualbeli') {
      whereClause.purpose = { [db.Sequelize.Op.notLike]: 'Pinjaman%' };
    }

    const history = await db.FinancingApplication.findAll({
      where: whereClause,
      attributes: [
        ['financing_id', 'id'],
        ['purpose', 'description'],
        ['required_amount', 'nominal_kredit'],
        ['monthly_installment', 'angsuran'],
        'status',
        ['created_at', 'tx_date'],
        'item_price',
        'total_tagihan',
        'down_payment'
      ],
      limit: 50,
      order: [['created_at', 'DESC']]
    });

    const paidInstallments = await db.BillItem.findAll({
      where: {
        member_id,
        category_code: {
          [db.Sequelize.Op.in]: ['TRANSACTION_INSTALLMENT', 'TRANSACTION_DOWN_PAYMENT']
        },
        status: 'PAID'
      }
    });

    let totalPaid = 0;
    paidInstallments.forEach(item => {
      totalPaid += parseFloat(item.amount || 0);
    });

    // Map totalPaid to the latest approved/active financing application
    // If there are multiple, this simple approach attributes all to the first one found for now.
    const result = history.map((h, idx) => {
      const data = h.toJSON ? h.toJSON() : h;
      if (idx === 0 && (data.status === 'APPROVED' || data.status === 'COMPLETED')) {
        const hasPaidDP = paidInstallments.some(item => item.category_code === 'TRANSACTION_DOWN_PAYMENT' || item.category_code === 'DP_PEMBIAYAAN');
        data.paid_amount = totalPaid + (!hasPaidDP ? parseFloat(data.down_payment || 0) : 0);
      } else {
        data.paid_amount = 0;
      }
      return data;
    });

    res.status(200).json({ status: true, data: result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export default getFinancingHistory;