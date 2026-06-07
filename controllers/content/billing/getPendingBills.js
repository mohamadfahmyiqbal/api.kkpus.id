// 📁 controllers/billing/getPendingBills.js
import db from "../../../models/index.js";
import { Op } from "sequelize";

const { BillType, BillItem } = db;

const getPendingBills = async (req, res) => {
  try {
    const memberId = req.userId;
    const billTypeIdRaw = req.query['bill_type_id[]'] || req.query.bill_type_id;

    if (!memberId) {
      return res.status(401).json({ status: false, message: "Otorisasi gagal." });
    }

    let itemCondition = {
      member_id: memberId,
      status: "UNPAID"
    };

    if (billTypeIdRaw) {
      itemCondition.bill_type_id = Array.isArray(billTypeIdRaw)
        ? { [Op.in]: billTypeIdRaw }
        : billTypeIdRaw;
    }

    const { count, rows } = await BillItem.findAndCountAll({
      where: itemCondition,
      include: [
        {
          model: BillType,
          as: "type",
          attributes: ["type_name", "category_map"],
          required: false,
        }
      ],
      // Gunakan 'createdAt' (Sequelize akan menerjemahkan ke 'created_at' karena underscored: true)
      order: [["createdAt", "ASC"]],
    });

    // --- FAIL-SAFE SYNC MIDTRANS ---
    // Jika masih ada tagihan UNPAID, pastikan bukan karena webhook localhost yang gagal
    if (rows.length > 0) {
      const billIdList = rows.map(b => b.bill_id).filter(Boolean);
      if (billIdList.length > 0) {
        const pendingTxs = await db.Transaction.findAll({
          where: { bill_id: billIdList, status: "PENDING" },
        });

        if (pendingTxs.length > 0) {
          try {
            const midtransClient = (await import("midtrans-client")).default;
            const snap = new midtransClient.Snap({
              isProduction: false,
              serverKey: process.env.MIDTRANS_SERVER_KEY,
              clientKey: process.env.MIDTRANS_CLIENT_KEY,
            });

            // Gunakan module terpisah agar rapi
            const { processLedgerRecording } = await import("../../utility/ledgerHelper.js");

            for (const tx of pendingTxs) {
              if (!tx.midtrans_order_id) continue;
              try {
                const midtransStatus = await snap.transaction.status(tx.midtrans_order_id);
                const tStatus = midtransStatus.transaction_status;
                const isPaid = (tStatus === "settlement" || tStatus === "capture");
                const isFailed = ["expire", "cancel", "deny"].includes(tStatus);
                const newStatus = isPaid ? "PAID" : (isFailed ? "EXPIRED" : "PENDING");

                if (newStatus !== "PENDING") {
                  const dbTx = await db.sequelize.transaction();
                  try {
                    await tx.update({
                      status: newStatus,
                      settlement_time: isPaid ? new Date() : null,
                      payment_type: midtransStatus.payment_type || tx.payment_type,
                    }, { transaction: dbTx });

                    if (isPaid && tx.bill_id) {
                      await db.Bill.update({ status: "paid" }, { where: { bill_id: tx.bill_id }, transaction: dbTx });
                      await db.BillItem.update({ status: "PAID" }, { where: { bill_id: tx.bill_id }, transaction: dbTx });
                      await processLedgerRecording(tx, dbTx);
                    }
                    await dbTx.commit();

                    // Update memory array agar response real-time PAID (tidak perlu fetch ulang)
                    if (isPaid) {
                      for (let i = rows.length - 1; i >= 0; i--) {
                        if (rows[i].bill_id === tx.bill_id) {
                          rows.splice(i, 1); // Buang dari daftar tagihan
                        }
                      }
                    }
                  } catch (err) {
                    await dbTx.rollback();
                    console.error("Gagal sinkronisasi fail-safe getPendingBills:", err);
                  }
                }
              } catch (midtransErr) {
                // Abaikan 404 jika transaksi baru saja dibuat dan belum ada di Midtrans
              }
            }
          } catch (importErr) {
            console.error("Fail-safe Midtrans dependencies error:", importErr);
          }
        }
      }
    }
    // --- END FAIL-SAFE SYNC ---

    return res.status(200).json({
      status: true,
      message: "Data rincian tagihan berhasil diambil.",
      total_count: count,
      data: rows,
    });

  } catch (error) {
    console.error("Error pada getPendingBills:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};

export default getPendingBills;