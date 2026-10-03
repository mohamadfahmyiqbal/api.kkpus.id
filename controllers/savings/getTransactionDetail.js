import db from "../../models/index.js";

export const getTransactionDetail = async (req, res) => {
  try {
    const { invoiceNumber } = req.params;

    const trx = await db.Transactions.findOne({
      where: { invoice_number: invoiceNumber },
    });

    if (!trx) {
      return res.status(404).json({
        success: false,
        message: "Transaksi tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      data: {
        invoiceNumber: trx.invoice_number,
        total: trx.total,
        adminFee: trx.admin_fee,
        method: trx.method,

        // TRANSFER
        bankName: trx.bank_name,
        bankAccountNo: trx.bank_account_no,
        bankAccountName: trx.bank_account_name,

        // TUNAI
        cashName: trx.cash_name,
        cashTransactionTime: trx.cash_transaction_time,
        cashLocation: trx.cash_location,

        // APPROVAL
        approvalPengawas: trx.approval_pengawas,
        approvalKetua: trx.approval_ketua,
        approvalBendahara: trx.approval_bendahara,

        createdAt: trx.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail transaksi",
    });
  }
};
