import db from "../../models/index.js";
import midtransClient from "midtrans-client";
import { processLedgerRecording } from "../utility/ledgerHelper.js";
import { sendGlobalNotification } from "../utility/notificationHelper.js";
import { sendToUser } from "../utility/socket.js";

const { Bill, BillItem, Transaction } = db;

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

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

    if (localTx.status === "PAID" || localTx.is_ledger_recorded) {
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
        await BillItem.update({ status: "PAID" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });
        await processLedgerRecording(lockedTx, dbTransaction);
      }

      await lockedTx.update({ is_ledger_recorded: true }, { transaction: dbTransaction });
    }

    await dbTransaction.commit();

    return res.status(200).json({ status: true, message: "Sinkronisasi sukses", data: { newStatus } });

  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("SYNC_ERROR:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};
