import moment from "moment";
import snap from "../utils/midtrans.js";
import MInvoices from "../../models/payment/MInvoices.js";
import MTrans from "../../models/transaksi/MTrans.js";
import MInvoices_detail from "../../models/payment/MInvoices_detail.js";

export const payInvoice = async (req, res) => {
  try {
    const {
      invoice_id,
      recipient_name,
      total_amount,
      selected_method,
      paymentDetails,
      recipient_id,
      base_amount,
      type,
      payment_status,
      invoices_detail,
    } = req.body;

    if (!invoice_id || !total_amount) {
      return res.status(400).json({
        success: false,
        message: "invoice_id dan total_amount wajib diisi",
      });
    }

    // Buat order_id unik (invoice + timestamp detik)
    const orderId = `${invoice_id}-${moment().format("YYMMDDHHmmss")}`;
    const grossAmount = parseInt(total_amount, 10);

    // Parameter transaksi ke Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: recipient_name || "Customer",
      },
    };

    if (selected_method) {
      parameter.enabled_payments = [selected_method];
    }

    // Buat transaksi Snap
    const transaction = await snap.createTransaction(parameter);

    // Update invoice berdasarkan invoice_id
    await MInvoices.update(
      {
        method: selected_method,
        total_amount: grossAmount,
        payment_token: orderId,
        payment_status,
      },
      { where: { invoice_id } }
    );

    // Simpan transaksi (ambil description dari paymentDetails[0])
    let jenis = null;
    if (Array.isArray(paymentDetails) && paymentDetails.length > 0) {
      jenis = paymentDetails[0].name || null;
    }
    await MInvoices_detail.create({
      invoice_id,
      name: invoices_detail.name,
      ammount: invoices_detail.ammount,
    });
    await MTrans.create({
      type,
      jenis,
      nik: recipient_id,
      cek: orderId,
      jumlah: base_amount,
      payment_status,
    });

    return res.json({
      success: true,
      message: "Invoice berhasil diproses",
      data: {
        invoice_id,
        order_id: orderId,
        payment_status: "Menunggu Pembayaran",
        snap_token: transaction.token,
        snap_redirect_url: transaction.redirect_url,
      },
    });
  } catch (error) {
    console.error("PayInvoice Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal membuat transaksi Midtrans",
      error: error.message || "Unknown error",
    });
  }
};
