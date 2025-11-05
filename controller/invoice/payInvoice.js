import moment from "moment/moment.js";
import snap from "../utils/midtrans.js";
import MInvoices from "../../models/payment/MInvoices.js";
import MInvoices_detail from "../../models/payment/MInvoices_detail.js";
import MTrans from "../../models/transaksi/MTrans.js";
import { MRequest } from "../../models/index.js";
import pus from "../../config/pus.js"; // pastikan ini instance Sequelize

export const payInvoice = async (req, res) => {
  const transaction = await pus.transaction(); // mulai transaksi database

  try {
    const {
      invoice_id,
      total_amount,
      selectedMethod,
      recipient_id,
      recipient_name,
      jenis,
      type,
      payment_desc,
      detailsInvoice = [],
    } = req.body;

    // 🔹 Validasi input
    if (!invoice_id || !total_amount || !recipient_id) {
      return res.status(400).json({
        success: false,
        message: "Data invoice tidak lengkap",
      });
    }

    // 🔹 Generate order ID unik
    const orderId = `${invoice_id}-${moment().format("YYMMDDHHmmss")}`;

    // 🔹 Hitung total amount termasuk biaya payment method
    const totalAmount =
      Number(total_amount) + Number(selectedMethod?.ammount || 0);

    // 🔹 Pastikan enabled_payments adalah array
    const enabledPayments = selectedMethod?.name
      ? Array.isArray(selectedMethod.name)
        ? selectedMethod.name
        : [selectedMethod.name]
      : undefined;

    // 🔹 Cek apakah invoice sudah pernah dibuat
    const existingInvoice = await MInvoices.findOne({
      where: { invoice_id },
    });

    if (!existingInvoice) {
      // 🧾 Simpan data invoice utama
      await MInvoices.create(
        {
          invoice_id,
          recipient_id,
          recipient_name,
          invoice_date: moment().format("YYYY-MM-DD"),
          expiration_date: moment().add(1, "days").format("YYYY-MM-DD"),
          jenis_trans: jenis,
          payment_status: "Menunggu Pembayaran",
          total_amount: total_amount,
          type_trans: type,
          order_id: orderId,
          payment_desc,
        },
        { transaction }
      );

      // 🧾 Simpan detail invoice dan update MTrans jika ada
      if (detailsInvoice.length > 0) {
        await Promise.all(
          detailsInvoice.map(async (dt) => {
            await MInvoices_detail.create(
              {
                invoice_id,
                name: dt.name,
                ammount: Number(dt.ammount || 0),
              },
              { transaction }
            );

            // Update MTrans berdasarkan ID transaksi (bukan invoice_id)
            if (dt.invoice_id) {
              await MTrans.update(
                { token: invoice_id },
                {
                  where: { id: dt.invoice_id },
                  transaction,
                }
              );
            } else {
              await MTrans.create(
                {
                  type,
                  jenis,
                  name: payment_desc,
                  nik: recipient_id,
                  jumlah: total_amount,
                  payment_status: "menunggu Pembayaran",
                  token: invoice_id,
                  createdAt: moment().format("YYYY-MM-DD HH:mm"),
                },
                { transaction }
              );
            }
          })
        );
      }

      // 🧾 Simpan data request
      await MRequest.create(
        {
          token: invoice_id,
          nik: recipient_id,
          tipe_request: jenis,
          status_payment: "Menunggu Pembayaran",
        },
        { transaction }
      );
    }

    // Commit penyimpanan database sebelum request ke Midtrans
    await transaction.commit();
    console.log("✅ Semua data tersimpan, lanjut verifikasi...");

    // 🔹 Siapkan data untuk custom field Midtrans
    const customFieldData = {
      invoice_id,
      recipient_id,
      recipient_name,
      jenis,
      type,
      payment_desc,
    };

    // Tambahkan info biaya transaksi ke selectedMethod
    if (selectedMethod) {
      selectedMethod.total_transaction_fee = Number(
        selectedMethod?.ammount || 0
      );
    }

    // 🔹 Parameter transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: Math.round(totalAmount),
      },
      expiry: { unit: "minutes", duration: 30 },
      ...(enabledPayments && { enabled_payments: enabledPayments }),
      custom_field1: JSON.stringify(customFieldData),
      custom_field2: JSON.stringify(selectedMethod),
    };

    // 🔹 Buat transaksi di Midtrans
    let midtransTrx;
    try {
      midtransTrx = await snap.createTransaction(parameter);
    } catch (midErr) {
      console.error("❌ Midtrans error:", midErr);
      return res.status(502).json({
        success: false,
        message: "Gagal membuat transaksi ke Midtrans",
        error: midErr.message || midErr,
      });
    }

    // ✅ Response sukses
    return res.status(200).json({
      success: true,
      message: "Transaksi berhasil dibuat",
      data: {
        order_id: orderId,
        gross_amount: totalAmount,
        token: midtransTrx.token,
        redirect_url: midtransTrx.redirect_url,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ payInvoice error:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message || error,
    });
  }
};
