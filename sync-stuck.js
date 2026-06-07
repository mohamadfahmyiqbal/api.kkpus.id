import "dotenv/config";
import db from "./models/index.js";
import midtransClient from "midtrans-client";
import { processLedgerRecording } from "./controllers/utility/ledgerHelper.js";

const { Transaction, Bill, BillItem } = db;

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

async function runSync() {
  console.log("Mencari transaksi PENDING...");
  try {
    const pendingTxs = await Transaction.findAll({
      where: { status: "PENDING" }
    });

    console.log(`Ditemukan ${pendingTxs.length} transaksi PENDING. Memulai sinkronisasi...`);

    for (const tx of pendingTxs) {
      if (!tx.midtrans_order_id) continue;
      
      try {
        const midtransStatus = await snap.transaction.status(tx.midtrans_order_id);
        const transactionStatus = midtransStatus.transaction_status;
        
        const isPaid = (transactionStatus === "settlement" || transactionStatus === "capture");
        const isFailed = ["expire", "cancel", "deny"].includes(transactionStatus);
        const newStatus = isPaid ? "PAID" : (isFailed ? "EXPIRED" : "PENDING");

        if (newStatus !== "PENDING") {
          const dbTransaction = await db.sequelize.transaction();
          try {
            await tx.update({
              status: newStatus,
              settlement_time: isPaid ? new Date() : null,
              payment_type: midtransStatus.payment_type || tx.payment_type,
            }, { transaction: dbTransaction });

            if (isPaid) {
              const targetBillId = tx.bill_id;
              if (targetBillId) {
                await Bill.update({ status: "paid" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });
                await BillItem.update({ status: "PAID" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });
                await processLedgerRecording(tx, dbTransaction);
              }
              await tx.update({ is_ledger_recorded: true }, { transaction: dbTransaction });
            }

            await dbTransaction.commit();
            console.log(`✅ Transaksi ${tx.midtrans_order_id} berhasil diupdate ke ${newStatus}`);
          } catch (err) {
            await dbTransaction.rollback();
            console.error(`❌ Gagal update DB untuk ${tx.midtrans_order_id}:`, err.message);
          }
        } else {
          console.log(`➖ Transaksi ${tx.midtrans_order_id} masih PENDING di Midtrans.`);
        }
      } catch (err) {
        if (err.message.includes("404")) {
          console.log(`⚠️ Transaksi ${tx.midtrans_order_id} tidak ditemukan di Midtrans (mungkin belum diproses user).`);
        } else {
          console.error(`❌ Gagal mengecek status ${tx.midtrans_order_id}:`, err.message);
        }
      }
    }
  } catch (error) {
    console.error("Fatal Error:", error);
  } finally {
    console.log("Proses selesai.");
    process.exit(0);
  }
}

runSync();
