import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export const createTransaction = async (req, res) => {
  try {
    const { invoice_id, gross_amount, customer } = req.body;

    const parameter = {
      transaction_details: {
        order_id: invoice_id,
        gross_amount: gross_amount,
      },
      customer_details: {
        first_name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
      },
      // Kalau tidak ada enabled_payments → otomatis semua metode ditampilkan
      // enabled_payments: ["credit_card", "bca_va", "bni_va", "gopay", "qris"], // kalau mau dibatasi
    };

    const transaction = await snap.createTransaction(parameter);
    res.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat transaksi" });
  }
};
