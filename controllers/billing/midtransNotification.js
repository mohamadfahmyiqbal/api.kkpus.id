// 📁 controllers/billing/midtransNotification.js

import db from "../../models/index.js";

const {
  Bill,
  Transaction,
  Member,
  MemberRegistration,
  MemberStatus,
  BillType,
  Account, // Model untuk tabel accounts
  SavingsTransaction, // Model untuk tabel savings_transactions
} = db;

const CODE_SIMPANAN_WAJIB = "SW_WAJIB";

export const midtransNotification = async (req, res) => {
  const notification = req.body;
  const orderId = notification.order_id;
  const transactionStatus = notification.transaction_status;
  const fraudStatus = notification.fraud_status;
  const grossAmount = parseFloat(notification.gross_amount);

  let transactionDb;
  try {
    transactionDb = await db.sequelize.transaction();

    // 1. Cari Transaksi Lokal di tabel transactions
    const localTransaction = await Transaction.findOne({
      where: { midtrans_order_id: orderId },
      transaction: transactionDb,
    });

    if (!localTransaction) {
      await transactionDb.rollback();
      return res.status(404).json({ message: "Order ID Not Found" });
    }

    // 2. Tentukan Status Transaksi Baru
    let newStatus = "PENDING";
    if (
      transactionStatus === "settlement" ||
      (transactionStatus === "capture" && fraudStatus === "accept")
    ) {
      newStatus = "PAID";
    } else if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      newStatus = "EXPIRED";
    } else if (transactionStatus === "pending") {
      newStatus = "PENDING";
    }

    // 3. Update Tabel Transaction & Tabel Bill Utama
    await localTransaction.update(
      {
        status: newStatus,
        settlement_time: newStatus === "PAID" ? new Date() : null,
      },
      { transaction: transactionDb }
    );

    const currentBill = await Bill.findByPk(localTransaction.bill_id, {
      transaction: transactionDb,
    });

    if (currentBill) {
      await currentBill.update(
        { status: newStatus === "PAID" ? "PAID" : "UNPAID" },
        { transaction: transactionDb }
      );
    }

    // =========================================================================
    // 🆕 LOGIKA UPDATE SALDO DINAMIS (JIKA STATUS PAID)
    // =========================================================================
    if (newStatus === "PAID") {
      // A. Cari Akun Simpanan Member
      const userAccount = await Account.findOne({
        where: { member_id: localTransaction.member_id },
        transaction: transactionDb,
      });

      if (userAccount) {
        // B. Buat Record Mutasi di savings_transactions
        await SavingsTransaction.create(
          {
            savings_account_id: userAccount.account_id,
            tx_type: "SETORAN",
            amount: grossAmount,
            tx_datetime: new Date(),
            method: localTransaction.payment_method || "MIDTRANS",
            bank_name: notification.va_numbers
              ? notification.va_numbers[0].bank
              : null,
            bank_account_no: notification.va_numbers
              ? notification.va_numbers[0].va_number
              : null,
            approved_status: "APPROVED",
            invoice_id: localTransaction.bill_id,
          },
          { transaction: transactionDb }
        );

        // C. Update current_balance di tabel accounts (Saldo Utama)
        await userAccount.increment("current_balance", {
          by: grossAmount,
          transaction: transactionDb,
        });

        console.log(
          `[Balance Update] Saldo Member ID ${localTransaction.member_id} bertambah: ${grossAmount}`
        );
      }
    }
    // =========================================================================

    // 4. Logika Lanjutan Berdasarkan Kategori Transaksi
    if (newStatus === "PAID") {
      const transactionCategory = localTransaction.tx_category;

      switch (transactionCategory) {
        case "MEMBER_REGISTRATION":
          // Update Status Pendaftaran & Aktivasi Member
          const registration = await MemberRegistration.findOne({
            where: { member_id: localTransaction.member_id },
            transaction: transactionDb,
          });

          if (registration) {
            await registration.update(
              { registration_status: "PAID" },
              { transaction: transactionDb }
            );

            // Aktifkan Member
            const member = await Member.findByPk(localTransaction.member_id, {
              transaction: transactionDb,
            });
            if (member) {
              const activeStatus = await MemberStatus.findOne({
                where: { status_name: "Aktif" },
                transaction: transactionDb,
              });
              await member.update(
                { status_id: activeStatus.status_id },
                { transaction: transactionDb }
              );
            }

            // --- LOGIKA GENERATE TAGIHAN BERULANG (Simpanan Wajib) ---
            const swWajibType = await BillType.findOne({
              where: { type_code: CODE_SIMPANAN_WAJIB },
              transaction: transactionDb,
            });
            if (swWajibType) {
              const currentYear = new Date().getFullYear();
              const currentMonth = new Date().getMonth() + 1;
              let newBills = [];

              for (let month = currentMonth + 1; month <= 12; month++) {
                newBills.push({
                  bill_type_id: swWajibType.bill_type_id,
                  member_id: localTransaction.member_id,
                  member_no: member.member_no,
                  description: `Simpanan Wajib Bulan ${month}/${currentYear}`,
                  amount: swWajibType.default_amount,
                  due_date: new Date(currentYear, month - 1, 10), // Jatuh tempo tgl 10
                  status: "UNPAID",
                });
              }
              if (newBills.length > 0) {
                await Bill.bulkCreate(newBills, { transaction: transactionDb });
              }
            }
          }
          break;

        default:
          console.log(
            `[Midtrans] Pembayaran kategori ${transactionCategory} berhasil diproses.`
          );
      }
    }

    await transactionDb.commit();
    return res
      .status(200)
      .json({
        status: "OK",
        message: "Transaction processed and Balance updated",
      });
  } catch (error) {
    if (transactionDb) await transactionDb.rollback();
    console.error("[Midtrans Webhook Error]:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
