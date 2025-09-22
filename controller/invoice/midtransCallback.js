import snap from "../utils/midtrans.js";
import MInvoices from "../../models/payment/MInvoices.js";
import MTrans from "../../models/transaksi/MTrans.js";
import { MAnggota, MRequest } from "../../models/index.js";
import { getPaymentFeesByName } from "./getPaymentFeesByName.js";
import MInvoices_detail from "../../models/payment/MInvoices_detail.js";

const mapPaymentStatus = (transaction_status, fraud_status) => {
  switch (transaction_status) {
    case "capture":
      return fraud_status === "challenge"
        ? "Challenge oleh FDS"
        : "Pembayaran Berhasil";
    case "settlement":
      return "Pembayaran Berhasil";
    case "pending":
      return "Menunggu Pembayaran";
    case "deny":
      return "Pembayaran Ditolak";
    case "expire":
      return "Pembayaran Kadaluarsa";
    case "cancel":
      return "Pembayaran Dibatalkan";
    default:
      return "UNKNOWN";
  }
};

export const midtransCallback = async (req, res) => {
  try {
    const notificationJson = req.body;
    const statusResponse = await snap.transaction.notification(
      notificationJson
    );

    const { order_id, transaction_status, fraud_status, gross_amount } =
      statusResponse;
    const statusMessage = mapPaymentStatus(transaction_status, fraud_status);

    if (transaction_status === "settlement") {
      const paymentMethod = statusResponse.acquirer;

      const findTransFee = await getPaymentFeesByName({
        body: { ret: "ret", name: paymentMethod },
      });

      const parts = order_id.split("-");

      const findInv = await MInvoices.findOne({
        where: { invoice_id: parts[0] },
      });

      const cekReq = await MRequest.findOne({
        where: { token: parts[0] },
        include: [{ association: "categoryAnggota" }],
      });

      let fee = 0;
      if (findTransFee.fee_type === "percentage") {
        // hitung fee berdasarkan persentase
        fee = (findInv.total_ammount * findTransFee.fee_value) / 100;
      } else {
        // gunakan langsung nilai fee
        fee = findTransFee.fee_value;
      }

      // Update invoice & transaksi
      await Promise.all([
        MInvoices.update(
          {
            method: paymentMethod,
            total_ammount: gross_amount,
            order_id: order_id,
            payment_status: statusMessage,
          },
          { where: { invoice_id: parts[0] } }
        ),
        MInvoices_detail.create({
          invoice_id: parts[0],
          name: findTransFee.description,
          ammount: fee,
        }),
        MTrans.update(
          { payment_status: statusMessage },
          {
            where: {
              token: parts[0],
            },
          }
        ),
      ]);
      if (findInv.jenis_trans === "pendaftaran_anggota") {
        await MAnggota.update(
          { status_anggota: "Approved", roles: cekReq.categoryAnggota.nama },
          { where: { nik: findInv.recipient_id } }
        );
      }
    }

    // // Kalau pembayaran settlement (berhasil), baru cek invoice & request
    // if (transaction_status === "settlement") {
    //   const cekInv = await MInvoices.findOne({
    //     where: { order_id },
    //     raw: true,
    //   });
    //   if (cekInv?.invoice_id) {
    //     const cekReq = await MRequest.findOne({
    //       where: { token: cekInv.invoice_id },
    //       include: [{ association: "categoryAnggota" }],
    //     });

    //     if (cekReq && cekReq.tipe_request === "pendaftaran_anggota") {
    //     }
    //   }
    // }

    return res.status(200).json({
      success: true,
      message: "Notifikasi berhasil diproses",
      status: statusMessage,
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
