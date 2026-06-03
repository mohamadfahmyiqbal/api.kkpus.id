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

    const history = await db.FinancingApplication.findAll({
      where: { member_id },
      attributes: [
        ['financing_id', 'id'],
        ['purpose', 'detail'],
        ['required_amount', 'nominal_kredit'],
        ['monthly_installment', 'angsuran'],
        'status',
        'created_at'
      ],
      limit: 50,
      order: [['created_at', 'DESC']]
    });

    res.status(200).json({ status: true, data: history });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export default getFinancingHistory;