// 📁 controllers/webhooks/dokuNotification.js
import db from "../../models/index.js";
import { verifyDokuSignature } from "../../services/dokuService.js";
import { sendGlobalNotification } from "../../services/notificationHelper.js";
import { sendToUser } from "../../utils/socket.js";
import { processLedgerRecording } from "../../services/ledgerHelper.js";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";
import { syncJualBeliReport } from "../../services/jualBeliReportSyncService.js";
import { syncSavingsReportList } from "../../services/savingsReportSyncService.js";

const { Bill, BillItem, Transaction, Member } = db;

export const dokuNotification = async (req, res) => {
  const notification = req.body;
  const headers = req.headers;

  console.log("[DOKU Webhook] Incoming notification headers:", JSON.stringify(headers));
  console.log("[DOKU Webhook] Incoming notification body:", JSON.stringify(notification));

  // 1. Verifikasi Signature DOKU (Optional validation fallback jika di development/sandbox)
  const isSignatureValid = verifyDokuSignature(headers, notification, "/webhooks/doku/notification");
  if (!isSignatureValid && process.env.NODE_ENV === "production") {
    console.warn("[DOKU Webhook] Invalid Signature detected!");
    return res.status(403).json({ message: "Invalid Signature Key" });
  }

  // DOKU Jokul notification payload format:
  // order.invoice_number
  // transaction.status ("SUCCESS", "FAILED")
  const orderId = notification.order?.invoice_number || notification.order_id || notification.invoice_number;
  const transactionStatus = (
    notification.transaction?.status ||
    notification.transaction_status ||
    ""
  ).toUpperCase();

  if (!orderId) {
    return res.status(400).json({ message: "Invoice number / Order ID not found in payload" });
  }

  const grossAmount = parseFloat(notification.order?.amount || notification.gross_amount || 0);

  let dbTransaction;
  try {
    // 2. Cegah Double Processing
    const checkTx = await Transaction.findOne({ where: { midtrans_order_id: orderId }, raw: true });
    if (!checkTx) {
      console.warn(`[DOKU Webhook] Transaction with order_id ${orderId} not found in DB`);
      return res.status(404).json({ message: "Order ID Not Found" });
    }

    if (checkTx.status === "PAID" || checkTx.is_ledger_recorded) {
      return res.status(200).json({ status: "OK", message: "Already Processed" });
    }

    dbTransaction = await db.sequelize.transaction();

    const localTx = await Transaction.findOne({
      where: { midtrans_order_id: orderId },
      transaction: dbTransaction,
      lock: dbTransaction.LOCK.UPDATE,
    });

    const isPaid = transactionStatus === "SUCCESS" || transactionStatus === "SETTLEMENT" || transactionStatus === "PAID";
    const isFailed = ["FAILED", "EXPIRED", "CANCELLED", "DENY"].includes(transactionStatus);
    const newStatus = isPaid ? "PAID" : isFailed ? "EXPIRED" : "PENDING";

    console.log(`[DOKU Webhook] Order: ${orderId}, Status: ${transactionStatus} -> DB Status: ${newStatus}`);

    await localTx.update(
      {
        status: newStatus,
        settlement_time: isPaid ? new Date() : null,
        payment_type: "doku",
      },
      { transaction: dbTransaction }
    );

    // 3. Logika Pembukuan & Pelunasan
    if (isPaid) {
      const targetBillId = localTx.bill_id;

      if (targetBillId) {
        await Bill.update(
          { status: "paid" },
          { where: { bill_id: targetBillId }, transaction: dbTransaction }
        );
        await BillItem.update(
          { status: "PAID" },
          {
            where: { bill_id: targetBillId },
            transaction: dbTransaction,
            individualHooks: true,
          }
        );

        // Ledger recording
        await processLedgerRecording(localTx, dbTransaction);

        // Handle Pelunasan Pembiayaan
        if (localTx.tx_category === "FINANCING_PAYMENT") {
          try {
            console.log(`[DOKU Webhook ReconcilePelunasan] bill_id: ${targetBillId}`);
            let pelunasanApp = null;
            const billItem = await BillItem.findOne({
              where: { bill_id: targetBillId },
              transaction: dbTransaction,
            });

            if (billItem && billItem.financing_application_id) {
              pelunasanApp = await db.FinancingApplication.findByPk(
                billItem.financing_application_id,
                { transaction: dbTransaction }
              );
            }

            if (!pelunasanApp || !pelunasanApp.keterangan?.startsWith("PELUNASAN_REF:")) {
              pelunasanApp = await db.FinancingApplication.findOne({
                where: {
                  member_id: localTx.member_id,
                  keterangan: { [db.Sequelize.Op.like]: "PELUNASAN_REF:%" },
                  status: { [db.Sequelize.Op.in]: ["APPROVED", "PENDING", "READY_TO_PAY", "COMPLETED"] },
                },
                order: [["created_at", "DESC"]],
                transaction: dbTransaction,
              });
            }

            if (pelunasanApp && pelunasanApp.keterangan?.startsWith("PELUNASAN_REF:")) {
              const originalFinancingId = pelunasanApp.keterangan.split(":")[1]?.trim();
              if (originalFinancingId) {
                await BillItem.update(
                  { status: "CANCELLED" },
                  {
                    where: {
                      financing_application_id: originalFinancingId,
                      status: "UNPAID",
                    },
                    transaction: dbTransaction,
                  }
                );

                await BillItem.create(
                  {
                    bill_id: targetBillId,
                    member_id: localTx.member_id,
                    category_code: "TRANSACTION_INSTALLMENT",
                    description: "Pembayaran Pelunasan Pembiayaan",
                    amount: pelunasanApp.total_tagihan,
                    due_date: new Date(),
                    status: "PAID",
                    financing_application_id: originalFinancingId,
                  },
                  { transaction: dbTransaction }
                );

                await db.FinancingApplication.update(
                  { status: "COMPLETED" },
                  { where: { financing_id: originalFinancingId }, transaction: dbTransaction }
                );
                await db.FinancingApplication.update(
                  { status: "COMPLETED" },
                  { where: { financing_id: pelunasanApp.financing_id }, transaction: dbTransaction }
                );
              }
            }
          } catch (err) {
            console.error("[DOKU Webhook ReconcilePelunasan] Error:", err);
          }
        }
      }

      // 4. Logika Registrasi Member (Aktivasi Akhir)
      if (localTx.tx_category === "MEMBER_REGISTRATION") {
        console.log(`[DOKU Webhook] Activating member: ${localTx.member_id}`);
        const reg = await db.MemberRegistration.findOne({
          where: { member_id: localTx.member_id },
          transaction: dbTransaction,
          lock: dbTransaction.LOCK.UPDATE,
        });

        if (reg) {
          await reg.update(
            { registration_status: "SELESAI", final_status: "APPROVED" },
            { transaction: dbTransaction }
          );

          const membertypeFromReg = reg.membertype?.toLowerCase() || "";
          let targetStatusName = "Anggota Reguler";
          if (membertypeFromReg.includes("luar biasa")) {
            targetStatusName = "Anggota Luar Biasa";
          }

          const targetStatus = await db.MemberStatus.findOne({
            where: { status_name: targetStatusName },
            transaction: dbTransaction,
          });

          if (targetStatus) {
            await db.Member.update(
              {
                status_id: targetStatus.status_id,
                member_type: targetStatus.status_name,
                join_date: new Date(),
                is_registration_done: 1,
              },
              { where: { member_id: localTx.member_id }, transaction: dbTransaction }
            );
          }
        }
      }

      await localTx.update({ is_ledger_recorded: true }, { transaction: dbTransaction });
    }

    await dbTransaction.commit();

    // 5. Notifikasi & Sync Financial Summary
    if (isPaid) {
      await syncFinancialSummary(db.sequelize, localTx.member_id);
      await syncJualBeliReport(db.sequelize, localTx.member_id);
      await syncSavingsReportList(db.sequelize);

      setImmediate(() => {
        sendGlobalNotification({
          memberId: localTx.member_id,
          title: "Pembayaran Berhasil!",
          content: `Pembayaran sebesar Rp ${grossAmount.toLocaleString("id-ID")} telah berhasil diterima via DOKU.`,
          type: "PAYMENT_SUCCESS",
        }).catch((err) => console.error("Notification Fail:", err));

        sendToUser(localTx.member_id, "new_notification", {
          notification_id: null,
          title: "Pembayaran Berhasil!",
          content: `Pembayaran sebesar Rp ${grossAmount.toLocaleString("id-ID")} telah berhasil diterima.`,
          type: "PAYMENT_SUCCESS",
          sent_datetime: new Date().toISOString(),
          status: 1,
        });

        sendToUser(localTx.member_id, "PAYMENT_SUCCESSFUL", {
          orderId: orderId,
          status: "PAID",
        });
      });
    }

    return res.status(200).json({ status: "SUCCESS" });
  } catch (error) {
    console.error("DOKU_WEBHOOK_ERROR:", error);
    if (dbTransaction) await dbTransaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};
