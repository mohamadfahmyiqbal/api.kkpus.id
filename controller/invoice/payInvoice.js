import moment from "moment";
import snap from "../utils/midtrans.js";

export const payInvoice = async (req, res) => {
  try {
    const { invoice_id, recipient_name, detailsInvoice, selected_method } =
      req.body;

    if (
      !invoice_id ||
      !detailsInvoice?.length ||
      !Array.isArray(detailsInvoice)
    ) {
      return res.status(400).json({
        success: false,
        message: "invoice_id dan detailsInvoice wajib diisi",
      });
    }

    const orderId = `${invoice_id}-${moment().format("YYMMDDHHmmss")}`;

    const grossAmount = detailsInvoice.reduce(
      (sum, item) => sum + Number(item.ammount || 0),
      0
    );

    const itemDetails = detailsInvoice.map((detail, idx) => ({
      id: detail.id?.toString() || `item-${idx + 1}`,
      price: Number(detail.ammount || 0),
      quantity: Number(detail.qty || 1),
      name: detail.name || `Item ${idx + 1}`,
    }));

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: recipient_name || "Customer",
      },
      item_details: itemDetails,
      expiry: {
        unit: "minutes",
        duration: 120,
      },
      enabled_payments: selected_method ? [selected_method] : undefined,
      finish_redirect_url: "https://kkpus.id/invoice",
    };

    const transaction = await snap.createTransaction(parameter);

    return res.status(200).json({
      success: true,
      message: "Transaksi berhasil dibuat",
      data: {
        order_id: orderId,
        gross_amount: grossAmount,
        redirect_url: transaction.redirect_url,
        token: transaction.token,
      },
    });
  } catch (error) {
    console.error("Midtrans Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat transaksi Midtrans",
      error: error.message || error,
    });
  }
};
