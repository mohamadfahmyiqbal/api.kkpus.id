import midtransClient from "midtrans-client";
import MInvoices from "../../models/payment/MInvoices.js";
import MTrans from "../../models/transaksi/MTrans.js";
import snap from "../utils/midtrans.js";

export const midtransCallback = async (req, res) => {
  try {
    // Body notifikasi langsung dari Midtrans
    const notificationJson = req.body;

    // Validasi & ambil status dari Midtrans Core API
    const statusResponse = await snap.transaction.notification(
      notificationJson
    );
    console.log(notificationJson);

    const { order_id, transaction_status, fraud_status } = statusResponse;

    // console.log("🔔 Midtrans Notification:", statusResponse);

    let statusMessage = "UNKNOWN";
    if (transaction_status === "capture") {
      statusMessage =
        fraud_status === "challenge"
          ? "Challenge oleh FDS"
          : "Pembayaran Berhasil";
    } else if (transaction_status === "settlement") {
      statusMessage = "Pembayaran Berhasil";
    } else if (transaction_status === "pending") {
      statusMessage = "Menunggu Pembayaran";
    } else if (transaction_status === "deny") {
      statusMessage = "Pembayaran Ditolak";
    } else if (transaction_status === "expire") {
      statusMessage = "Pembayaran Kadaluarsa";
    } else if (transaction_status === "cancel") {
      statusMessage = "Pembayaran Dibatalkan";
    }

    // // Update invoice
    await MInvoices.update(
      { payment_status: statusMessage },
      { where: { payment_token: order_id } }
    );
    await MTrans.update(
      { payment_status: statusMessage },
      { where: { cek: order_id } }
    );

    return res.status(200).json({
      success: true,
      message: "Midtrans callback processed",
      data: {
        order_id,
        transaction_status,
        fraud_status,
        status: statusMessage,
      },
    });
  } catch (error) {
    console.error("⚠️ Midtrans Callback Error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal memproses notifikasi",
      error: error.message,
    });
  }
};
