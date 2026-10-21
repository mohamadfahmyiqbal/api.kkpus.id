import db from "../../models/index.js";

export const getAdminTabunganBills = async (req, res) => {
  try {
    const { id } = req.params; // member_saving_target_id

    if (!id) {
      return res.status(400).json({ status: false, message: "ID Tabungan diperlukan." });
    }

    const { BillItem, Bill, Transaction } = db;

    let bills = await BillItem.findAll({
      where: {
        category_code: `TAB_DEP_${id}`
      },
      include: [
        {
          model: Bill,
          as: "bill",
          required: false,
          include: [
            {
              model: Transaction,
              as: "payments",
              required: false,
            }
          ]
        }
      ],
      order: [["due_date", "ASC"]]
    });

    const formattedBills = bills.map(item => {
      const latestPayment = item.bill?.payments && item.bill.payments.length > 0
        ? [...item.bill.payments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
        : null;

      let displayStatus = item.status;
      if (item.status === 'UNPAID') {
        if (latestPayment && latestPayment.status === 'PENDING_VERIFICATION') {
          displayStatus = 'PENDING_VERIFICATION';
        } else if (item.bill && item.bill.status === 'pending_verification') {
          displayStatus = 'PENDING_VERIFICATION';
        }
      }

      return {
        ...item.toJSON(),
        status: displayStatus,
        transaction_id: latestPayment?.transaction_id || null,
        proof_of_transfer: latestPayment?.proof_of_transfer || null,
        sender_name: latestPayment?.sender_name || null,
        sender_bank: latestPayment?.sender_bank || null,
      };
    });

    return res.status(200).json({
      status: true,
      message: "Daftar tagihan tabungan berhasil diambil (Admin).",
      data: formattedBills
    });

  } catch (error) {
    console.error("Error pada getAdminTabunganBills:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message
    });
  }
};
