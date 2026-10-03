import db from "../../models/index.js";

export const getPelunasanBillItems = async (req, res) => {
  try {
    const { id } = req.params; // financing_id dari pengajuan asli
    const memberId = req.userId;

    const app = await db.FinancingApplication.findOne({
      where: { financing_id: id, member_id: memberId }
    });

    if (!app) {
      return res.status(404).json({ status: false, message: "Pembiayaan tidak ditemukan." });
    }

    if (app.status === 'COMPLETED') {
      return res.status(400).json({ status: false, message: "Pembiayaan sudah lunas." });
    }

    // Ambil semua BillItem UNPAID milik pengajuan ini
    const unpaidItems = await db.BillItem.findAll({
      where: {
        financing_application_id: id,
        member_id: memberId,
        status: 'UNPAID',
        category_code: 'TRANSACTION_INSTALLMENT'
      },
      order: [['created_at', 'ASC']]
    });

    if (unpaidItems.length === 0) {
      return res.status(400).json({ status: false, message: "Tidak ada tagihan yang perlu dibayar." });
    }

    const bill_item_ids = unpaidItems.map(item => item.bill_item_id);
    const amount = unpaidItems.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);

    return res.json({
      status: true,
      data: {
        financing_id: id,
        bill_item_ids,
        amount,
        item_count: unpaidItems.length
      }
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};
