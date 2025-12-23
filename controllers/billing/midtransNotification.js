import db from "../../models/index.js";
import crypto from "crypto";

const { Bill, Transaction, Member, MemberRegistration, BillType, Account } = db;

const CODE_SIMPANAN_WAJIB = "SW_WAJIB";

export const midtransNotification = async (req, res) => {
  const notification = req.body;

  // 1. Verifikasi Signature Key (Keamanan agar tidak bisa ditembak sembarangan)
  const serverKey = process.env.MIDTRANS_SERVER_KEY; // Pastikan ini ada di .env
  const combinedStr =
    notification.order_id +
    notification.status_code +
    notification.gross_amount +
    serverKey;
  const signatureKey = crypto
    .createHash("sha512")
    .update(combinedStr)
    .digest("hex");

  if (signatureKey !== notification.signature_key) {
    console.error("[Midtrans Webhook] Unauthorized Access: Invalid Signature");
    return res.status(403).json({ message: "Invalid Signature Key" });
  }

  const orderId = notification.order_id;
  const transactionStatus = notification.transaction_status;
  const fraudStatus = notification.fraud_status;
  const grossAmount = parseFloat(notification.gross_amount);

  // Ekstraksi VA Number untuk informasi metode pembayaran
  const paymentType = notification.payment_type;
  let vaNumber = null;
  let bankName = null;

  if (notification.va_numbers && notification.va_numbers.length > 0) {
    vaNumber = notification.va_numbers[0].va_number;
    bankName = notification.va_numbers[0].bank;
  } else if (notification.permata_va_number) {
    vaNumber = notification.permata_va_number;
    bankName = "permata";
  } else if (paymentType === "echannel") {
    vaNumber = notification.bill_key;
    bankName = "mandiri";
  }

  let dbTransaction;
  try {
    dbTransaction = await db.sequelize.transaction();

    // 2. Cari Transaksi Lokal berdasarkan Order ID Midtrans
    const localTx = await Transaction.findOne({
      where: { midtrans_order_id: orderId },
      transaction: dbTransaction,
    });

    if (!localTx) {
      await dbTransaction.rollback();
      return res.status(404).json({ message: "Order ID Not Found" });
    }

    // 3. Tentukan Status Transaksi Baru
    let newStatus = "PENDING";
    if (
      transactionStatus === "settlement" ||
      (transactionStatus === "capture" && fraudStatus === "accept")
    ) {
      newStatus = "PAID";
    } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
      newStatus = "EXPIRED";
    }

    // 4. Update Data Transaksi (Audit Midtrans)
    await localTx.update(
      {
        status: newStatus,
        midtrans_transaction_id: notification.transaction_id,
        payment_type: paymentType,
        payment_method: bankName || paymentType,
        va_number: vaNumber,
        bank_name: bankName,
        fraud_status: fraudStatus,
        status_message: notification.status_message,
        settlement_time: newStatus === "PAID" ? new Date() : null,
      },
      { transaction: dbTransaction }
    );

    // 5. Update Status Tagihan (Bills) - Gunakan huruf kecil sesuai model Anda
    if (localTx.bill_id) {
      await Bill.update(
        { status: newStatus === "PAID" ? "PAID" : "UNPAID" },
        { where: { bill_id: localTx.bill_id }, transaction: dbTransaction }
      );
    }

    // 6. LOGIKA MUTASI SALDO (Hanya jika status PAID dan belum tercatat di Ledger)
    if (newStatus === "PAID" && !localTx.is_ledger_recorded) {
      // Ambil atau buat akun simpanan anggota
      let [userAccount] = await Account.findOrCreate({
        where: { member_id: localTx.member_id, account_type: "SAVINGS" },
        defaults: {
          account_no: `ACC-${localTx.member_id}-${Date.now()
            .toString()
            .slice(-4)}`,
          current_balance: 0,
          open_date: new Date(),
          akad_type: "WADI'AH",
        },
        transaction: dbTransaction,
      });

      // Update Saldo jika jenisnya SETORAN (Termasuk Simpanan Sukarela)
      if (localTx.tx_type === "SETORAN") {
        await userAccount.increment("current_balance", {
          by: grossAmount,
          transaction: dbTransaction,
        });
      }

      // Tandai agar tidak terjadi double increment jika webhook terkirim ulang
      await localTx.update(
        { is_ledger_recorded: true },
        { transaction: dbTransaction }
      );

      // 7. LOGIKA KHUSUS BERDASARKAN KATEGORI
      const category = localTx.tx_category;

      // Kasus: Pendaftaran Member Baru
      if (category === "MEMBER_REGISTRATION") {
        const reg = await MemberRegistration.findOne({
          where: { member_id: localTx.member_id },
          transaction: dbTransaction,
        });

        if (reg) {
          await reg.update(
            { registration_status: "selesai" },
            { transaction: dbTransaction }
          );
          await Member.update(
            { status_id: reg.member_type },
            {
              where: { member_id: localTx.member_id },
              transaction: dbTransaction,
            }
          );

          // Generate Tagihan Simpanan Wajib otomatis untuk sisa bulan dalam setahun
          const swType = await BillType.findOne({
            where: { type_code: CODE_SIMPANAN_WAJIB },
            transaction: dbTransaction,
          });

          if (swType) {
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            let futureBills = [];

            for (let m = currentMonth + 1; m <= 12; m++) {
              futureBills.push({
                bill_type_id: swType.bill_type_id,
                member_id: localTx.member_id,
                member_no: localTx.member_no,
                description: `Simpanan Wajib Bulan ${m}/${currentYear}`,
                amount: swType.default_amount,
                due_date: new Date(currentYear, m - 1, 10),
                status: "UNPAID",
              });
            }
            if (futureBills.length > 0) {
              await Bill.bulkCreate(futureBills, {
                transaction: dbTransaction,
              });
            }
          }
        }
      }
      // Kasus: Simpanan Sukarela (Hanya log/notifikasi tambahan jika perlu)
      else if (category === "DEPOSIT_SUKARELA") {
        console.log(
          `[Webhook] Sukses Topup Sukarela: ${localTx.member_no} sebesar ${grossAmount}`
        );
      }
    }

    await dbTransaction.commit();
    return res
      .status(200)
      .json({ status: "OK", message: "Notification Processed Successfully" });
  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("[Midtrans Webhook Error]:", error);
    return res.status(500).json({ status: "Error", message: error.message });
  }
};
