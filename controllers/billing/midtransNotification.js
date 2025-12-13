// 📁 controllers/billing/midtransNotification.js (KODE FINAL LENGKAP)

import db from "../../models/index.js";
import { verifySignatureKey } from "../../controllers/utility/midtransApi.js";

// 🛑 IMPORT SERVICE BARU
// Pastikan path ini benar!
import { activateMember } from "../../services/registrationService.js";

const { Bill, Transaction } = db;

export const midtransNotification = async (req, res) => {
  const notification = req.body;
  const orderId = notification.order_id;
  const transactionStatus = notification.transaction_status;
  // Gross Amount ini adalah total yang dibayar pelanggan (Base Amount + Fee)
  const grossAmount = parseFloat(notification.gross_amount);

  // 1. Verifikasi Signature (KEAMANAN)
  // *Pastikan Anda telah mengimplementasikan logika verifikasi signature di sini*
  // if (!verifySignatureKey(notification, notification.signature_key)) { ... }

  let transactionDb;
  try {
    transactionDb = await db.sequelize.transaction();

    // 2. Cari Transaksi Lokal
    const localTransaction = await Transaction.findOne({
      where: { midtrans_order_id: orderId },
      transaction: transactionDb,
    });

    if (!localTransaction) {
      await transactionDb.rollback();
      return res.status(404).json({ message: "Order ID Not Found" });
    }

    const currentBill = await Bill.findByPk(localTransaction.bill_id, {
      transaction: transactionDb,
    });

    // 🛑 TAMBAHAN: Baca Jenis Transaksi dari kolom 'tx_category'
    const transactionCategory = localTransaction.tx_category;

    // 3. Tentukan Status Baru
    // Menggunakan nama properti status yang sudah dikoreksi: 'status'
    let newBillStatus = currentBill.status;
    let newTransactionStatus = localTransaction.status;

    if (
      transactionStatus === "settlement" ||
      (transactionStatus === "capture" &&
        notification.fraud_status === "accept")
    ) {
      newBillStatus = "PAID";
      newTransactionStatus = "SETTLED";
    } else if (transactionStatus === "pending") {
      newBillStatus = "PENDING";
      newTransactionStatus = "PENDING";
    } else if (["deny", "expire", "cancel"].includes(transactionStatus)) {
      newBillStatus = "UNPAID";
      newTransactionStatus = "CANCELED";
    }

    // 4. Update Database (Bill & Transaction Status/Amount)
    // Update kolom 'status' di tabel bills
    if (newBillStatus !== currentBill.status) {
      await currentBill.update(
        { status: newBillStatus },
        { transaction: transactionDb }
      );
    }

    // Update Transaction: Status dan AMOUNT (mencatat grossAmount final)
    if (
      newTransactionStatus !== localTransaction.status ||
      localTransaction.amount != grossAmount
    ) {
      await localTransaction.update(
        { status: newTransactionStatus, amount: grossAmount },
        { transaction: transactionDb }
      );
    }

    // 5. LOGIKA LANJUTAN BERDASARKAN JENIS TRANSAKSI (HANYA JIKA SETTLEMENT)
    if (newTransactionStatus === "SETTLED") {
      console.log(
        `[Midtrans Notification] Memproses kategori transaksi: ${transactionCategory}`
      );

      switch (transactionCategory) {
        case "MEMBER_REGISTRATION":
          // 🛑 PANGGIL LOGIKA AKTIVASI MEMBER DENGAN LOGIKA DINAMIS
          await activateMember(
            localTransaction.member_id,
            localTransaction.bill_id,
            transactionDb
          );
          break;
        case "SUBSCRIPTION_FEE":
          // Tambahkan logika untuk perpanjangan langganan di sini
          // Contoh: await SubscriptionService.extendSubscription(localTransaction.member_id, transactionDb);
          break;
        default:
          console.warn(
            `[Midtrans Notification] Kategori transaksi tidak memerlukan aksi lanjutan: ${transactionCategory}`
          );
      }
    }

    await transactionDb.commit();

    // WAJIB: Midtrans harus menerima respons 200 OK
    return res
      .status(200)
      .json({ message: "Notification handled successfully" });
  } catch (error) {
    if (transactionDb) await transactionDb.rollback();
    console.error("[Midtrans Notification Error]:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
