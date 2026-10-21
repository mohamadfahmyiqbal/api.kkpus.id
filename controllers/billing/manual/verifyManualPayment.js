import db from "../../../models/index.js";
import { processLedgerRecording } from "../../../services/ledgerHelper.js";
import { syncFinancialSummary } from "../../../services/financialSummarySyncService.js";
import { syncJualBeliReport } from "../../../services/jualBeliReportSyncService.js";
import { sendGlobalNotification } from "../../../services/notificationHelper.js";
import { sendToUser } from "../../../utils/socket.js";

const { Bill, BillItem, Transaction, Member } = db;

/**
 * Controller untuk verifikasi pembayaran manual oleh Admin / Bendahara (Approve / Reject)
 */
export const verifyManualPayment = async (req, res) => {
  let dbTransaction;
  try {
    const { transaction_id, action, admin_note } = req.body;
    // action: 'APPROVE' | 'REJECT'

    if (!transaction_id || !["APPROVE", "REJECT"].includes(action?.toUpperCase())) {
      return res.status(400).json({
        status: false,
        message: "transaction_id dan action ('APPROVE' atau 'REJECT') diperlukan.",
      });
    }

    dbTransaction = await db.sequelize.transaction();

    const tx = await Transaction.findByPk(transaction_id, {
      include: [{ model: Member, as: "member" }],
      transaction: dbTransaction,
    });

    if (!tx) {
      await dbTransaction.rollback();
      return res.status(404).json({ status: false, message: "Transaksi tidak ditemukan." });
    }

    if (tx.status === "PAID") {
      await dbTransaction.rollback();
      return res.status(400).json({ status: false, message: "Transaksi ini sudah disetujui sebelumnya." });
    }

    const isApprove = action.toUpperCase() === "APPROVE";
    const newStatus = isApprove ? "PAID" : "REJECTED";

    await tx.update(
      {
        status: newStatus,
        settlement_time: isApprove ? new Date() : null,
        admin_note: admin_note || null,
        verified_by: req.userId || null,
        verified_at: new Date(),
      },
      { transaction: dbTransaction }
    );

    if (isApprove) {
      // 1. Update Bill & BillItems
      if (tx.bill_id) {
        await Bill.update(
          { status: "paid" },
          { where: { bill_id: tx.bill_id }, transaction: dbTransaction }
        );
        await BillItem.update(
          { status: "PAID" },
          { where: { bill_id: tx.bill_id }, transaction: dbTransaction }
        );
      }

      // 2. Aktivasi Anggota jika tx_category = MEMBER_REGISTRATION
      if (tx.tx_category === "MEMBER_REGISTRATION") {
        const reg = await db.MemberRegistration.findOne({
          where: { member_id: tx.member_id },
          transaction: dbTransaction,
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
              { where: { member_id: tx.member_id }, transaction: dbTransaction }
            );
          }
        }
      }

      // 3. Catat ke Buku Kas / Ledger
      await processLedgerRecording(tx, dbTransaction);
    } else {
      // Jika REJECT, kembalikan status bill ke pending agar bisa upload ulang
      if (tx.bill_id) {
        await Bill.update(
          { status: "pending" },
          { where: { bill_id: tx.bill_id }, transaction: dbTransaction }
        );
      }
    }

    await dbTransaction.commit();

    // 4. Sinkronisasi Ringkasan & Kirim Notifikasi Socket
    if (isApprove) {
      await syncFinancialSummary(db.sequelize, tx.member_id);
      await syncJualBeliReport(db.sequelize, tx.member_id);

      sendGlobalNotification({
        memberId: tx.member_id,
        title: "Pembayaran Diterima!",
        content: `Pembayaran manual sebesar Rp ${parseFloat(tx.amount).toLocaleString("id-ID")} telah diverifikasi oleh Bendahara/Admin.`,
        type: "PAYMENT_SUCCESS",
      }).catch((err) => console.error("Verify Notification Fail:", err));

      sendToUser(tx.member_id, "new_notification", {
        notification_id: null,
        title: "Pembayaran Diterima!",
        content: `Pembayaran manual sebesar Rp ${parseFloat(tx.amount).toLocaleString("id-ID")} telah diverifikasi.`,
        type: "PAYMENT_SUCCESS",
        sent_datetime: new Date().toISOString(),
        status: 1,
      });
    } else {
      sendGlobalNotification({
        memberId: tx.member_id,
        title: "Pembayaran Ditolak",
        content: `Bukti transfer Anda ditolak. Alasan: ${admin_note || "Bukti tidak valid atau dana belum masuk"}. Silakan upload ulang.`,
        type: "PAYMENT_REJECTED",
      }).catch((err) => console.error("Reject Notification Fail:", err));
    }

    return res.status(200).json({
      status: true,
      message: `Pembayaran berhasil di-${action.toLowerCase()}.`,
      data: {
        transaction_id: tx.transaction_id,
        status: newStatus,
      },
    });
  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("VERIFY_MANUAL_PAYMENT_ERROR:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Gagal memverifikasi pembayaran manual.",
    });
  }
};
