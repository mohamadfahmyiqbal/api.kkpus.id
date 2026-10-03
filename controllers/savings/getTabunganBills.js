// 📁 controllers/savings/getTabunganBills.js
import db from "../../models/index.js";
import midtransClient from "midtrans-client";
import { checkDokuTransactionStatus } from "../../services/dokuService.js";
import { processLedgerRecording } from "../../services/ledgerHelper.js";

const getTabunganBills = async (req, res) => {
  try {
    const memberId = req.userId;
    const { id } = req.params; // member_saving_target_id

    if (!memberId) {
      return res.status(401).json({ status: false, message: "Otorisasi gagal." });
    }

    if (!id) {
      return res.status(400).json({ status: false, message: "ID Tabungan diperlukan." });
    }

    const { BillItem } = db;

    let bills = await BillItem.findAll({
      where: {
        member_id: memberId,
        category_code: `TAB_DEP_${id}`
      },
      order: [["due_date", "ASC"]]
    });

    // Sinkronisasi status dengan Midtrans untuk tagihan yang masih UNPAID
    const unpaidBills = bills.filter(b => b.status === "UNPAID" && b.bill_id);
    if (unpaidBills.length > 0) {
      const billIdList = unpaidBills.map(b => b.bill_id);
      
      const pendingTxs = await db.Transaction.findAll({
        where: {
          bill_id: billIdList,
          status: "PENDING"
        },
        order: [["created_at", "DESC"]]
      });

      if (pendingTxs.length > 0) {
        const snap = new midtransClient.Snap({
          isProduction: false,
          serverKey: process.env.MIDTRANS_SERVER_KEY,
          clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });

        for (const localTx of pendingTxs) {
          try {
            let isPaid = false;
            let isFailed = false;
            let newStatus = "PENDING";
            let detectedPaymentType = localTx.payment_type;

            if (localTx.payment_type === "doku") {
              const dokuStatus = await checkDokuTransactionStatus(localTx.midtrans_order_id);
              const tStatus = (dokuStatus?.transaction?.status || dokuStatus?.status || "").toUpperCase();
              isPaid = (tStatus === "SUCCESS" || tStatus === "SETTLEMENT" || tStatus === "PAID");
              isFailed = ["FAILED", "EXPIRED", "CANCELLED", "DENY"].includes(tStatus);
              newStatus = isPaid ? "PAID" : (isFailed ? "EXPIRED" : "PENDING");
              detectedPaymentType = "doku";
            } else {
              const midtransStatus = await snap.transaction.status(localTx.midtrans_order_id);
              const transactionStatus = midtransStatus.transaction_status;
              isPaid = (transactionStatus === "settlement" || transactionStatus === "capture");
              isFailed = ["expire", "cancel", "deny"].includes(transactionStatus);
              newStatus = isPaid ? "PAID" : (isFailed ? "EXPIRED" : "PENDING");
              detectedPaymentType = midtransStatus.payment_type || localTx.payment_type;
            }

            if (newStatus !== "PENDING") {
              const dbTransaction = await db.sequelize.transaction();
              try {
                await localTx.update({
                  status: newStatus,
                  settlement_time: isPaid ? new Date() : null,
                  payment_type: detectedPaymentType,
                }, { transaction: dbTransaction });

                if (isPaid) {
                  const targetBillId = localTx.bill_id;
                  await db.Bill.update({ status: "paid" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });
                  await db.BillItem.update(
                    { status: "PAID" }, 
                    { 
                      where: { bill_id: targetBillId }, 
                      transaction: dbTransaction,
                      individualHooks: true
                    }
                  );
                  await processLedgerRecording(localTx, dbTransaction);
                  
                  const { syncFinancialSummary } = await import("../../services/financialSummarySyncService.js");
                  await syncFinancialSummary(db.sequelize, localTx.member_id);
                  
                  // Update bills in memory
                  bills = bills.map(b => b.bill_id === targetBillId ? { ...b.toJSON(), status: "PAID" } : b);
                }
                
                await dbTransaction.commit();
              } catch (updateErr) {
                await dbTransaction.rollback();
                console.error("Gagal update status transaksi:", updateErr);
              }
            }
          } catch (midtransErr) {
            if (!midtransErr.message?.includes("404")) {
              console.error("Gagal sinkronisasi status Midtrans:", midtransErr);
            }
          }
        }
      }
    }

    return res.status(200).json({
      status: true,
      message: "Daftar tagihan tabungan berhasil diambil.",
      data: bills
    });

  } catch (error) {
    console.error("Error pada getTabunganBills:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message
    });
  }
};

export default getTabunganBills;
