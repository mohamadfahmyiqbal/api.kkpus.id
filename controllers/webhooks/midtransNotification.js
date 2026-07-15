import db from "../../models/index.js";
import crypto from "crypto";
import { sendGlobalNotification } from "../../services/notificationHelper.js";
import { sendToUser } from "../../utils/socket.js";

import { processLedgerRecording } from "../../services/ledgerHelper.js";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";
import { syncJualBeliReport } from "../../services/jualBeliReportSyncService.js";
import { syncSavingsReportList } from "../../services/savingsReportSyncService.js";

const {
  Bill, BillItem, BillType, Transaction, Member,
  Account, MemberSavingsAccount, MemberRegistration, MemberStatus, SavingsProduct
} = db;

export const midtransNotification = async (req, res) => {
  const notification = req.body;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  
  // 1. Validasi Signature Key
  const combinedStr = notification.order_id + notification.status_code + notification.gross_amount + serverKey;
  const signatureKey = crypto.createHash("sha512").update(combinedStr).digest("hex");

  if (signatureKey !== notification.signature_key) {
    return res.status(403).json({ message: "Invalid Signature Key" });
  }

  const { order_id: orderId, transaction_status: transactionStatus } = notification;
  const grossAmount = parseFloat(notification.gross_amount);

  let dbTransaction;
  try {
    // 2. Cek Awal & Cegah Double Processing
    const checkTx = await Transaction.findOne({ where: { midtrans_order_id: orderId } });
    if (!checkTx) return res.status(404).json({ message: "Order ID Not Found" });
    if (checkTx.status === "PAID" || checkTx.is_ledger_recorded) {
      return res.status(200).json({ status: "OK", message: "Already Processed" });
    }

    dbTransaction = await db.sequelize.transaction();

    const localTx = await Transaction.findOne({
      where: { midtrans_order_id: orderId },
      transaction: dbTransaction,
      lock: dbTransaction.LOCK.UPDATE
    });

    const isPaid = (transactionStatus === "settlement" || transactionStatus === "capture");
    const isFailed = ["expire", "cancel", "deny"].includes(transactionStatus);
    const newStatus = isPaid ? "PAID" : (isFailed ? "EXPIRED" : "PENDING");

    console.log(`[Midtrans Webhook] Order: ${orderId}, Status: ${transactionStatus} -> DB Status: ${newStatus}`);

    await localTx.update({
      status: newStatus,
      settlement_time: isPaid ? new Date() : null,
      payment_type: notification.payment_type,
    }, { transaction: dbTransaction });

    // 3. Logika Pembukuan
    if (isPaid) {
      const targetBillId = localTx.bill_id;

      if (targetBillId) {
        await Bill.update({ status: "paid" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });
        await BillItem.update(
          { status: "PAID" }, 
          { 
            where: { bill_id: targetBillId }, 
            transaction: dbTransaction,
            individualHooks: true 
          }
        );

        // ✅ Gunakan helper untuk pembukuan ledger & saldo simpanan
        await processLedgerRecording(localTx, dbTransaction);

        // ✅ Handle Pelunasan: Jika ini adalah pembayaran pelunasan, mark tagihan asli sebagai PAID
        if (localTx.tx_category === "FINANCING_PAYMENT") {
          try {
            console.log(`[ReconcilePelunasan] Start for tx_category: ${localTx.tx_category}, bill_id: ${targetBillId}`);
            let pelunasanApp = null;

            // Cara 1: via BillItem yang terhubung ke bill_id transaksi ini
            const billItem = await BillItem.findOne({ where: { bill_id: targetBillId }, transaction: dbTransaction });
            if (billItem && billItem.financing_application_id) {
              pelunasanApp = await db.FinancingApplication.findByPk(billItem.financing_application_id, { transaction: dbTransaction });
              console.log(`[ReconcilePelunasan] Found pelunasanApp via Cara 1: ${pelunasanApp?.financing_id}`);
            }

            // Cara 2: fallback - cari FinancingApplication milik member yang punya PELUNASAN_REF
            if (!pelunasanApp || !pelunasanApp.keterangan?.startsWith('PELUNASAN_REF:')) {
              pelunasanApp = await db.FinancingApplication.findOne({
                where: {
                  member_id: localTx.member_id,
                  keterangan: { [db.Sequelize.Op.like]: 'PELUNASAN_REF:%' },
                  status: { [db.Sequelize.Op.in]: ['APPROVED', 'PENDING', 'READY_TO_PAY', 'COMPLETED'] }
                },
                order: [['created_at', 'DESC']],
                transaction: dbTransaction
              });
              console.log(`[ReconcilePelunasan] Found pelunasanApp via Cara 2: ${pelunasanApp?.financing_id}`);
            }

            if (pelunasanApp && pelunasanApp.keterangan && pelunasanApp.keterangan.startsWith('PELUNASAN_REF:')) {
              const originalFinancingId = pelunasanApp.keterangan.split(':')[1]?.trim();
              if (originalFinancingId) {
                console.log(`[ReconcilePelunasan] Target originalFinancingId: ${originalFinancingId}`);
                // 1. Batalkan (CANCEL) sisa tagihan asli agar tidak terhitung penuh (mencegah overcalculation)
                const updatedBills = await BillItem.update(
                  { status: 'CANCELLED' },
                  { 
                    where: { 
                      financing_application_id: originalFinancingId,
                      status: 'UNPAID'
                    }, 
                    transaction: dbTransaction 
                  }
                );
                console.log(`[ReconcilePelunasan] Updated ${updatedBills[0]} BillItems to CANCELLED.`);

                // 2. Buat satu tagihan baru khusus untuk pelunasan dengan nominal final (setelah diskon) dan set status PAID
                await BillItem.create({
                  bill_id: targetBillId,
                  member_id: localTx.member_id,
                  category_code: 'TRANSACTION_INSTALLMENT',
                  description: 'Pembayaran Pelunasan Pembiayaan',
                  amount: pelunasanApp.total_tagihan,
                  due_date: new Date(),
                  status: 'PAID',
                  financing_application_id: originalFinancingId
                }, { transaction: dbTransaction });
                console.log(`[ReconcilePelunasan] Created 1 final PAID BillItem for original financing with amount: ${pelunasanApp.total_tagihan}`);
                await db.FinancingApplication.update(
                  { status: 'COMPLETED' },
                  { where: { financing_id: originalFinancingId }, transaction: dbTransaction }
                );
                await db.FinancingApplication.update(
                  { status: 'COMPLETED' },
                  { where: { financing_id: pelunasanApp.financing_id }, transaction: dbTransaction }
                );
                console.log(`[ReconcilePelunasan] SUCCESS updating apps to COMPLETED.`);
              } else {
                console.log(`[ReconcilePelunasan] Could not parse originalFinancingId.`);
              }
            } else {
              console.log(`[ReconcilePelunasan] No valid pelunasanApp found or invalid keterangan.`);
            }
          } catch (err) {
            console.error(`[ReconcilePelunasan] ERROR:`, err);
          }
        }
      }

      // 4. Logika Registrasi Member (Aktivasi Akhir)
      if (localTx.tx_category === "MEMBER_REGISTRATION") {
        console.log(`[Midtrans Webhook] Activating member after registration payment: ${localTx.member_id}`);
        const reg = await db.MemberRegistration.findOne({
          where: { member_id: localTx.member_id },
          transaction: dbTransaction,
          lock: dbTransaction.LOCK.UPDATE
        });
        if (reg) {
          await reg.update({ registration_status: "SELESAI", final_status: "APPROVED" }, { transaction: dbTransaction });

          // Mapping member_type dari registrasi ke member_statuses
          const membertypeFromReg = reg.membertype?.toLowerCase() || "";

          let targetStatusName = "Anggota Reguler"; // Default
          if (membertypeFromReg.includes("luar biasa")) {
            targetStatusName = "Anggota Luar Biasa";
          }

          const targetStatus = await db.MemberStatus.findOne({
            where: { status_name: targetStatusName },
            transaction: dbTransaction
          });

          if (targetStatus) {
            await db.Member.update(
              {
                status_id: targetStatus.status_id,
                member_type: targetStatus.status_name,
                join_date: new Date(),
                is_registration_done: 1
              },
              { where: { member_id: localTx.member_id }, transaction: dbTransaction }
            );
          }
        }
      }

      // Logika Sukuk Investment
      if (localTx.tx_category === "SUKUK_INVESTMENT") {
        const targetBillId = localTx.bill_id;
        if (targetBillId) {
          const billItem = await BillItem.findOne({ where: { bill_id: targetBillId }, transaction: dbTransaction });
          if (billItem && billItem.description) {
            // Description format: Pembelian Sukuk (Order #8)
            const match = billItem.description.match(/Order #(\d+)/);
            if (match && match[1]) {
              const orderId = match[1];
              await db.sequelize.query(
                `UPDATE sukuk_orders SET status = 'PAID' WHERE order_id = :orderId`,
                {
                  replacements: { orderId },
                  transaction: dbTransaction
                }
              );
              console.log(`[Midtrans Webhook] Updated sukuk_orders ${orderId} to PAID`);

              const order = await db.SukukOrder.findOne({ where: { order_id: orderId }, transaction: dbTransaction });
              if (order) {
                 const issue = await db.SukukIssue.findOne({ where: { issue_id: order.sukuk_issue_id }, transaction: dbTransaction });
                 if (issue) {
                    const totalPaid = await db.SukukOrder.sum('amount', {
                       where: { sukuk_issue_id: issue.issue_id, status: 'PAID' },
                       transaction: dbTransaction
                    });
                    
                    if (totalPaid >= issue.total_amount) {
                       await issue.update({ status: 'BERJALAN' }, { transaction: dbTransaction });
                       console.log(`[Midtrans Webhook] Updated sukuk_issues ${issue.issue_id} to BERJALAN`);
                    }
                 }
              }
            }
          }
        }
      }

      await localTx.update({ is_ledger_recorded: true }, { transaction: dbTransaction });
    }

    await dbTransaction.commit();

    // 5. Notifikasi (Non-blocking) & Sync Financial Summary
    if (isPaid) {
      await syncFinancialSummary(db.sequelize, localTx.member_id);
      await syncJualBeliReport(db.sequelize, localTx.member_id);
      await syncSavingsReportList(db.sequelize);
      setImmediate(() => {
        sendGlobalNotification({
          memberId: localTx.member_id,
          title: "Pembayaran Berhasil!",
          content: `Setoran sebesar Rp ${grossAmount.toLocaleString("id-ID")} telah diterima. Keanggotaan Anda kini aktif.`,
          type: "PAYMENT_SUCCESS"
        }).catch(err => console.error("Notification Fail:", err));

        // Emit new_notification agar frontend refresh bills & profile
        sendToUser(localTx.member_id, "new_notification", {
          notification_id: null,
          title: "Pembayaran Berhasil!",
          content: `Setoran sebesar Rp ${grossAmount.toLocaleString("id-ID")} telah diterima.`,
          type: "PAYMENT_SUCCESS",
          sent_datetime: new Date().toISOString(),
          status: 1,
        });

        // Trigger UI refresh transaksi
        if (localTx.tx_category === "SUKUK_INVESTMENT" || localTx.tx_category === "FINANCING_PAYMENT") {
          // Cari orderId untuk Sukuk jika ada
          sendToUser(localTx.member_id, "TRANSACTION_UPDATED", {
            entityRef: localTx.tx_category,
            status: "PAID",
            trigger: true
          });
        }
      });
    }

    return res.status(200).json({ status: "OK" });

  } catch (error) {
    console.error("TRANSACTION_ERROR_MIDTRANS:", error);
    if (dbTransaction) await dbTransaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};