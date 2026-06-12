// 📁 controllers/savings/getTabunganBills.js
import db from "../../models/index.js";
import midtransClient from "midtrans-client";
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
            const midtransStatus = await snap.transaction.status(localTx.midtrans_order_id);
            const transactionStatus = midtransStatus.transaction_status;
            const isPaid = (transactionStatus === "settlement" || transactionStatus === "capture");
            const isFailed = ["expire", "cancel", "deny"].includes(transactionStatus);
            const newStatus = isPaid ? "PAID" : (isFailed ? "EXPIRED" : "PENDING");

            if (newStatus !== "PENDING") {
              const dbTransaction = await db.sequelize.transaction();
              try {
                await localTx.update({
                  status: newStatus,
                  settlement_time: isPaid ? new Date() : null,
                  payment_type: midtransStatus.payment_type,
                }, { transaction: dbTransaction });

                if (isPaid) {
                  const targetBillId = localTx.bill_id;
                  await db.Bill.update({ status: "paid" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });
                  await db.BillItem.update({ status: "PAID" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });
                  await processLedgerRecording(localTx, dbTransaction);
                  
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
