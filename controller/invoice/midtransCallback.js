import snap from "../utils/midtrans.js";
import MInvoices from "../../models/payment/MInvoices.js";
import MInvoices_detail from "../../models/payment/MInvoices_detail.js";
import MTrans from "../../models/transaksi/MTrans.js";
import { MAnggota, MRequest } from "../../models/index.js";
import pus from "../../config/pus.js"; // Sequelize instance
import MAnggotaWallet from "../../models/anggota/MAnggotaWallet.js";

// 🔹 Mapping status Midtrans ke status internal sistem
const mapPaymentStatus = (transaction_status, fraud_status) => {
  const map = {
    capture:
      fraud_status === "challenge"
        ? "Challenge oleh FDS"
        : "Pembayaran Berhasil",
    settlement: "Pembayaran Berhasil",
    pending: "Menunggu Pembayaran",
    deny: "Pembayaran Ditolak",
    expire: "Pembayaran Kadaluarsa",
    cancel: "Pembayaran Dibatalkan",
  };
  return map[transaction_status] || "UNKNOWN";
};

export const midtransCallback = async (req, res) => {
  const transaction = await pus.transaction();

  try {
    // 🔹 Ambil notifikasi dari Midtrans
    const statusResponse = await snap.transaction.notification(req.body);
    const {
      order_id,
      recipient_id,
      transaction_status,
      fraud_status,
      custom_field1,
      custom_field2,
    } = statusResponse;

    // 🔹 Parse custom field (gunakan default {} jika gagal)
    let customFieldData = {};
    let paymentMethod = {};
    try {
      customFieldData = JSON.parse(custom_field1);
      paymentMethod = JSON.parse(custom_field2);
    } catch {
      console.warn("⚠️ Gagal parse custom_field, gunakan default kosong");
    }

    // 🔹 Validasi invoice_id
    if (!customFieldData?.invoice_id) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Invoice ID tidak ditemukan di custom_field1" });
    }

    const statusMessage = mapPaymentStatus(transaction_status, fraud_status);

    // 🔹 Fungsi pembaruan invoice dan tabel terkait
    const updateInvoiceStatus = async () => {
      // Ambil data invoice lengkap
      const invoice = await MInvoices.findOne({
        where: { invoice_id: customFieldData.invoice_id },
        include: [
          { association: "detailsInvoice", required: false },
          {
            association: "requestInvoice",
            include: [{ association: "categoryAnggota" }],
          },
          {
            association: "transInvoice",
            include: [
              {
                association: "anggota",
                include: [{ association: "categoryAnggota" }],
              },
            ],
          },
          { association: "invoiceWallet" },
        ],
        transaction,
      });

      // console.log(Number(invoice.total_ammount), Number(invoice.balance));

      if (!invoice) {
        console.warn(
          `⚠️ Invoice tidak ditemukan untuk ID: ${customFieldData.invoice_id}`
        );
        throw new Error("Invoice tidak ditemukan");
      }

      // 🔹 Update status pembayaran di semua tabel terkait
      const updateData = { order_id, payment_status: statusMessage };
      await Promise.all([
        MInvoices.update(updateData, {
          where: { invoice_id: invoice.invoice_id },
          transaction,
        }),
        MTrans.update(updateData, {
          where: { token: invoice.invoice_id },
          transaction,
        }),
        MRequest.update(
          { status_payment: statusMessage },
          { where: { token: invoice.invoice_id }, transaction }
        ),
        MAnggotaWallet.update(
          {
            balance:
              Number(invoice?.total_amount) +
              Number(invoice.invoiceWallet.balance),
          },
          {
            where: {
              nik: invoice?.recipient_id,
            },
          }
        ),
      ]);

      // 🔹 Tambah detail pembayaran jika belum ada
      const isDetailExist = invoice.detailsInvoice?.some(
        (d) =>
          d.name === paymentMethod?.desc && d.ammount === paymentMethod?.ammount
      );

      if (!isDetailExist && paymentMethod?.desc && paymentMethod?.ammount) {
        await MInvoices_detail.create(
          {
            invoice_id: invoice.invoice_id,
            name: paymentMethod.desc,
            ammount: paymentMethod.ammount,
          },
          { transaction }
        );
        console.log(`✅ Detail pembayaran '${paymentMethod.desc}' ditambahkan`);
      }

      // 🔹 Jika jenis transaksi = pendaftaran anggota → update status anggota
      if (invoice.jenis_trans === "pendaftaran_anggota") {
        await MAnggota.update(
          {
            status_anggota: invoice?.requestInvoice?.tipe_anggota,
            roles: invoice?.requestInvoice?.tipe_anggota,
          },
          {
            where: { nik: invoice?.requestInvoice?.nik },
            transaction,
          }
        );
        console.log("✅ Status anggota diperbarui");
      }
    };

    // 🔹 Tangani setiap status transaksi Midtrans
    switch (transaction_status) {
      case "pending":
        console.log("🕒 Transaksi masih pending, status disimpan sementara.");
        break;

      case "settlement":
        console.log("✅ Pembayaran berhasil, update status & tandai lunas.");
        await updateInvoiceStatus();
        break;

      case "expire":
        console.log("⛔ Transaksi kadaluarsa, update status invoice.");
        await updateInvoiceStatus();
        break;

      case "deny":
      case "cancel":
        console.log("🚫 Transaksi dibatalkan atau ditolak.");
        await updateInvoiceStatus();
        break;

      default:
        console.log("⚠️ Status tidak dikenal:", transaction_status);
        break;
    }

    // 🔹 Commit transaksi jika semua sukses
    await transaction.commit();
    return res.status(200).json({
      message: "Callback Midtrans berhasil diproses",
      status: statusMessage,
      order_id,
    });
  } catch (error) {
    console.error("❌ Error midtransCallback:", error);
    if (transaction) await transaction.rollback();
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan internal", error: error.message });
  }
};
