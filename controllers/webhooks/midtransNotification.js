import db from "../../models/index.js";
import crypto from "crypto";
import { sendGlobalNotification } from "../utility/notificationHelper.js";
import { sendToUser } from "../utility/socket.js";

import { processLedgerRecording } from "../utility/ledgerHelper.js";

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
        await BillItem.update({ status: "PAID" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });

        // ✅ Gunakan helper untuk pembukuan ledger & saldo simpanan
        await processLedgerRecording(localTx, dbTransaction);
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

      await localTx.update({ is_ledger_recorded: true }, { transaction: dbTransaction });
    }

    await dbTransaction.commit();

    // 5. Notifikasi (Non-blocking)
    if (isPaid) {
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
      });
    }

    return res.status(200).json({ status: "OK" });

  } catch (error) {
    console.error("TRANSACTION_ERROR_MIDTRANS:", error);
    if (dbTransaction) await dbTransaction.rollback();
    return res.status(500).json({ message: error.message });
  }
};