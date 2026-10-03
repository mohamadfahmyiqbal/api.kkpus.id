import db from "../../models/index.js";
import midtransClient from "midtrans-client";
import { processLedgerRecording } from "../../services/ledgerHelper.js";
import { sendGlobalNotification } from "../../services/notificationHelper.js";
import { sendToUser } from "../../utils/socket.js";
import { syncFinancialSummary } from "../../services/financialSummarySyncService.js";
import { syncJualBeliReport } from "../../services/jualBeliReportSyncService.js";

const { Bill, BillItem, Transaction } = db;

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

// Helper: reconcile pelunasan - mark semua BillItem pengajuan asli sebagai PAID
async function reconcilePelunasan(tx, dbTx) {
  try {
    console.log(`[ReconcilePelunasan] Start for tx_category: ${tx.tx_category}, bill_id: ${tx.bill_id}`);
    let pelunasanApp = null;

    // Cara 1: via BillItem yang terhubung ke bill_id transaksi
    if (tx.bill_id) {
      const billItem = await BillItem.findOne({
        where: { bill_id: tx.bill_id },
        transaction: dbTx
      });
      if (billItem?.financing_application_id) {
        pelunasanApp = await db.FinancingApplication.findByPk(billItem.financing_application_id, { transaction: dbTx });
        console.log(`[ReconcilePelunasan] Found pelunasanApp via Cara 1: ${pelunasanApp?.financing_id}`);
      }
    }

    // Cara 2: fallback via member + keterangan (termasuk status COMPLETED supaya tidak terlewat)
    if (!pelunasanApp?.keterangan?.startsWith('PELUNASAN_REF:')) {
      pelunasanApp = await db.FinancingApplication.findOne({
        where: {
          member_id: tx.member_id,
          keterangan: { [db.Sequelize.Op.like]: 'PELUNASAN_REF:%' },
          status: { [db.Sequelize.Op.in]: ['APPROVED', 'PENDING', 'READY_TO_PAY', 'COMPLETED'] }
        },
        order: [['created_at', 'DESC']],
        transaction: dbTx
      });
      console.log(`[ReconcilePelunasan] Found pelunasanApp via Cara 2: ${pelunasanApp?.financing_id}`);
    }

    if (!pelunasanApp?.keterangan?.startsWith('PELUNASAN_REF:')) {
      console.log(`[ReconcilePelunasan] No valid pelunasanApp found or invalid keterangan.`);
      return;
    }

    const originalFinancingId = pelunasanApp.keterangan.split(':')[1]?.trim();
    if (!originalFinancingId) {
      console.log(`[ReconcilePelunasan] Could not parse originalFinancingId.`);
      return;
    }

    console.log(`[ReconcilePelunasan] Target originalFinancingId: ${originalFinancingId}`);

    // Cek apakah pengajuan ASLI sudah di-reconcile
    const originalApp = await db.FinancingApplication.findByPk(originalFinancingId, { transaction: dbTx });
    if (!originalApp) {
      console.log(`[ReconcilePelunasan] Original app not found.`);
      return;
    }
    if (originalApp.status === 'COMPLETED') {
      console.log(`[ReconcilePelunasan] Original app already COMPLETED.`);
      return;
    }

    const updatedBills = await BillItem.update(
      { status: 'PAID' },
      { where: { financing_application_id: originalFinancingId, status: 'UNPAID' }, transaction: dbTx }
    );
    console.log(`[ReconcilePelunasan] Updated ${updatedBills[0]} BillItems to PAID.`);

    await db.FinancingApplication.update(
      { status: 'COMPLETED' },
      { where: { financing_id: originalFinancingId }, transaction: dbTx }
    );
    await db.FinancingApplication.update(
      { status: 'COMPLETED' },
      { where: { financing_id: pelunasanApp.financing_id }, transaction: dbTx }
    );
    
    console.log(`[ReconcilePelunasan] SUCCESS updating apps to COMPLETED.`);
  } catch (error) {
    console.error(`[ReconcilePelunasan] ERROR:`, error);
  }
}

export const syncMidtransStatus = async (req, res) => {
  const { order_id } = req.body;
  if (!order_id) {
    return res.status(400).json({ status: false, message: "order_id diperlukan" });
  }

  let dbTransaction;
  try {
    const localTx = await Transaction.findOne({
      where: { midtrans_order_id: order_id }
    });

    if (!localTx) {
      return res.status(404).json({ status: false, message: "Transaksi tidak ditemukan" });
    }

    // Jika transaksi sudah PAID, tetap jalankan reconcile pelunasan jika belum
    if (localTx.status === "PAID" || localTx.is_ledger_recorded) {
      if (localTx.tx_category === "FINANCING_PAYMENT") {
        await reconcilePelunasan(localTx, null);
      }
      
      // PASTI jalankan sync financial summary meskipun sudah terekam di ledger
      await syncFinancialSummary(db.sequelize, localTx.member_id);
      
      return res.status(200).json({ status: true, message: "Sudah diproses" });
    }

    // Tanya Midtrans
    const midtransStatus = await snap.transaction.status(localTx.midtrans_order_id);
    const transactionStatus = midtransStatus.transaction_status;

    const isPaid = (transactionStatus === "settlement" || transactionStatus === "capture");
    const isFailed = ["expire", "cancel", "deny"].includes(transactionStatus);
    const newStatus = isPaid ? "PAID" : (isFailed ? "EXPIRED" : "PENDING");

    if (!isPaid && !isFailed) {
      return res.status(200).json({ status: true, message: "Status masih PENDING di Midtrans" });
    }

    dbTransaction = await db.sequelize.transaction();

    const lockedTx = await Transaction.findOne({
      where: { midtrans_order_id: order_id },
      transaction: dbTransaction,
      lock: dbTransaction.LOCK.UPDATE
    });

    await lockedTx.update({
      status: newStatus,
      settlement_time: isPaid ? new Date() : null,
      payment_type: midtransStatus.payment_type || lockedTx.payment_type,
    }, { transaction: dbTransaction });

    if (isPaid) {
      const targetBillId = lockedTx.bill_id;

      if (targetBillId) {
        await Bill.update({ status: "paid" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });
        await BillItem.update(
          { status: "PAID" },
          { where: { bill_id: targetBillId }, transaction: dbTransaction, individualHooks: true }
        );
        await processLedgerRecording(lockedTx, dbTransaction);

        if (lockedTx.tx_category === "FINANCING_PAYMENT") {
          await reconcilePelunasan(lockedTx, dbTransaction);
        }
      }

      await lockedTx.update({ is_ledger_recorded: true }, { transaction: dbTransaction });
    }

    await dbTransaction.commit();

    if (isPaid) {
      await syncFinancialSummary(db.sequelize, lockedTx.member_id);
      await syncJualBeliReport(db.sequelize, lockedTx.member_id);
    }

    return res.status(200).json({ status: true, message: "Sinkronisasi sukses", data: { newStatus } });

  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("SYNC_ERROR:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
