// 📁 controllers/billing/midtransNotification.js

import db from "../../models/index.js";

const { Bill, Transaction, Member, MemberRegistration, BillType, Account } = db;

const CODE_SIMPANAN_WAJIB = "SW_WAJIB";

export const midtransNotification = async (req, res) => {
  const notification = req.body;
  const orderId = notification.order_id;
  const transactionStatus = notification.transaction_status;
  const fraudStatus = notification.fraud_status;
  const grossAmount = parseFloat(notification.gross_amount);

  // 1. Ekstraksi detail pembayaran dari payload Midtrans
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

    // 2. Cari Transaksi Lokal
    const localTx = await Transaction.findOne({
      where: { midtrans_order_id: orderId },
      transaction: dbTransaction,
    });

    if (!localTx) {
      await dbTransaction.rollback();
      return res.status(404).json({ message: "Order ID Not Found" });
    }

    // 3. Tentukan Status Transaksi
    let newStatus = "PENDING";
    if (
      transactionStatus === "settlement" ||
      (transactionStatus === "capture" && fraudStatus === "accept")
    ) {
      newStatus = "PAID";
    } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
      newStatus = "EXPIRED";
    }

    // 4. Update Header Transaksi (Selalu update detail Midtrans untuk audit)
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

    // 5. Update Status Tagihan (Bill) jika ada
    if (localTx.bill_id) {
      await Bill.update(
        { status: newStatus === "PAID" ? "PAID" : "UNPAID" },
        { where: { bill_id: localTx.bill_id }, transaction: dbTransaction }
      );
    }

    // 6. LOGIKA MUTASI SALDO (Hanya jika status PAID dan belum tercatat di Ledger)
    if (newStatus === "PAID" && !localTx.is_ledger_recorded) {
      // A. Pastikan Account (Rekening) Member Tersedia
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

      // B. Update Saldo Berdasarkan tx_type (SETORAN bertambah, PENARIKAN berkurang)
      if (localTx.tx_type === "SETORAN") {
        await userAccount.increment("current_balance", {
          by: grossAmount,
          transaction: dbTransaction,
        });
      } else if (localTx.tx_type === "PENARIKAN") {
        await userAccount.decrement("current_balance", {
          by: grossAmount,
          transaction: dbTransaction,
        });
      }

      // C. Tandai bahwa transaksi ini sudah masuk ke perhitungan saldo (Ledger)
      await localTx.update(
        { is_ledger_recorded: true },
        { transaction: dbTransaction }
      );

      // 7. LOGIKA KHUSUS BERDASARKAN KATEGORI
      const category = localTx.tx_category;

      if (category === "MEMBER_REGISTRATION") {
        const reg = await MemberRegistration.findOne({
          where: { member_id: localTx.member_id },
          transaction: dbTransaction,
        });

        if (reg) {
          // Update Status Registrasi
          await reg.update(
            { registration_status: "selesai" },
            { transaction: dbTransaction }
          );

          // Update Status Member (Aktifkan berdasarkan member_type hasil registrasi)
          await Member.update(
            { status_id: reg.member_type },
            {
              where: { member_id: localTx.member_id },
              transaction: dbTransaction,
            }
          );

          // Generate Tagihan Simpanan Wajib Bulanan (Bulan depan s/d akhir tahun)
          const swType = await BillType.findOne({
            where: { type_code: CODE_SIMPANAN_WAJIB },
            transaction: dbTransaction,
          });

          if (swType) {
            const memberData = await Member.findByPk(localTx.member_id, {
              transaction: dbTransaction,
            });
            const currentYear = new Date().getFullYear();
            const currentMonth = new Date().getMonth() + 1;
            let futureBills = [];

            for (let m = currentMonth + 1; m <= 12; m++) {
              futureBills.push({
                bill_type_id: swType.bill_type_id,
                member_id: memberData.member_id,
                member_no: memberData.member_no,
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
    }

    await dbTransaction.commit();
    return res.status(200).json({ status: "OK", message: "Processed" });
  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("[Midtrans Webhook Error]:", error);
    return res.status(500).json({ status: "Error", message: error.message });
  }
};
