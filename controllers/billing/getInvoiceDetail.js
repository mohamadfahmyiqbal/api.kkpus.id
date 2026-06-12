// 📁 controllers/billing/getInvoiceDetail.js
import db from "../../models/index.js";
import { Op } from "sequelize";
import midtransClient from "midtrans-client";

import { processLedgerRecording } from "../../services/ledgerHelper.js";
import { sendGlobalNotification } from "../../services/notificationHelper.js";
import { sendToUser } from "../../utils/socket.js";

const { BillItem, BillType, Member } = db;

/**
 * Controller untuk mengambil detail invoice gabungan.
 * Menggunakan POST agar aman mengirim banyak ID di dalam body.
 */
export const getInvoiceDetail = async (req, res) => {
  try {
    // Mengambil array ID atau Bill ID dari body request
    const { bill_item_ids, bill_id } = req.body;

    // Validasi input
    if (
      (!bill_item_ids || !Array.isArray(bill_item_ids) || bill_item_ids.length === 0) &&
      !bill_id
    ) {
      return res.status(400).json({
        status: false,
        message: "Daftar ID rincian tagihan (array) atau Bill ID diperlukan dalam request body.",
      });
    }

    // Query Database menggunakan Operator IN atau bill_id
    // Prioritaskan bill_item_ids jika ada, karena itu adalah primary key
    const whereClause = (bill_item_ids && bill_item_ids.length > 0)
      ? { bill_item_id: { [Op.in]: bill_item_ids } }
      : { bill_id };

    const items = await BillItem.findAll({
      where: whereClause,
      include: [
        {
          model: BillType,
          as: "type",
          attributes: ["type_name", "type_code"]
        },
        {
          model: Member,
          as: "member",
          attributes: ["full_name", "member_no"]
        }
      ],
      order: [["createdAt", "ASC"]]
    });

    // Cek jika data ditemukan
    if (!items || items.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Data tagihan tidak ditemukan.",
      });
    }

    // Jika ada item UNPAID, coba sinkronkan status dengan Midtrans API (Fail-safe)
    const hasUnpaid = items.some(i => i.status === "UNPAID");
    if (hasUnpaid) {
      const billIdList = items.map(i => i.bill_id).filter(Boolean);
      if (billIdList.length > 0) {
        const localTx = await db.Transaction.findOne({
          where: {
            bill_id: billIdList,
            status: "PENDING"
          },
          order: [["created_at", "DESC"]]
        });

        if (localTx) {
          try {
            const snap = new midtransClient.Snap({
              isProduction: false,
              serverKey: process.env.MIDTRANS_SERVER_KEY,
              clientKey: process.env.MIDTRANS_CLIENT_KEY,
            });

            const midtransStatus = await snap.transaction.status(localTx.midtrans_order_id);
            const transactionStatus = midtransStatus.transaction_status;
            const isPaid = (transactionStatus === "settlement" || transactionStatus === "capture");
            const isFailed = ["expire", "cancel", "deny"].includes(transactionStatus);
            const newStatus = isPaid ? "PAID" : (isFailed ? "EXPIRED" : "PENDING");

            if (newStatus !== "PENDING") {
              const dbTransaction = await db.sequelize.transaction();
              try {
                // Update Transaction
                await localTx.update({
                  status: newStatus,
                  settlement_time: isPaid ? new Date() : null,
                  payment_type: midtransStatus.payment_type,
                }, { transaction: dbTransaction });

                if (isPaid) {
                  // Update Bill & BillItems
                  const targetBillId = localTx.bill_id;
                  await db.Bill.update({ status: "paid" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });
                  await db.BillItem.update({ status: "PAID" }, { where: { bill_id: targetBillId }, transaction: dbTransaction });

                  // Logika Aktivasi Member (jika MEMBER_REGISTRATION)
                  if (localTx.tx_category === "MEMBER_REGISTRATION") {
                    const reg = await db.MemberRegistration.findOne({
                      where: { member_id: localTx.member_id },
                      transaction: dbTransaction
                    });
                    if (reg) {
                      await reg.update({ registration_status: "SELESAI", final_status: "APPROVED" }, { transaction: dbTransaction });
                      
                      const membertypeFromReg = reg.membertype?.toLowerCase() || "";
                      let targetStatusName = "Anggota Reguler";
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

                  // ✅ Tambahkan pencatatan ledger saldo di sini
                  await processLedgerRecording(localTx, dbTransaction);

                  // ✅ Kirim notifikasi agar frontend menutup Snap & refresh
                  const grossAmount = parseFloat(localTx.amount);
                  setImmediate(() => {
                    sendGlobalNotification({
                      memberId: localTx.member_id,
                      title: "Pembayaran Berhasil!",
                      content: `Setoran sebesar Rp ${grossAmount.toLocaleString("id-ID")} telah diterima via sinkronisasi otomatis.`,
                      type: "PAYMENT_SUCCESS"
                    }).catch(err => console.error("Sync Notification Fail:", err));

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
                await dbTransaction.commit();

                // Refresh status items agar respons mencerminkan PAID
                for (const item of items) {
                  if (item.bill_id === localTx.bill_id) {
                    item.status = isPaid ? "PAID" : "UNPAID";
                  }
                }
              } catch (updateErr) {
                await dbTransaction.rollback();
                console.error("Gagal update status transaksi secara internal:", updateErr);
              }
            }
          } catch (midtransErr) {
            if (midtransErr.message?.includes("404")) {
              console.log(`[Midtrans Sync] Transaction ${localTx.midtrans_order_id} not found on Midtrans yet.`);
            } else {
              console.error("Gagal sinkronisasi status Midtrans:", midtransErr);
            }
          }
        }
      }
    }

    // Agregasi Data Response
    const firstItem = items[0];
    const responseData = {
      full_name: firstItem.member?.full_name || "N/A",
      member_no: firstItem.member?.member_no || "-",
      createdAt: firstItem.createdAt,
      // Status Invoice Gabungan: Jika ada 1 saja yang UNPAID, maka dianggap UNPAID
      status: items.some(i => i.status === "UNPAID") ? "UNPAID" : "PAID",
      details: items.map(item => ({
        bill_item_id: item.bill_item_id,
        description: item.description || item.type?.type_name || "Tagihan",
        type_name: item.type?.type_name,
        amount: parseFloat(item.amount),
        status: item.status
      }))
    };

    return res.status(200).json({
      status: true,
      message: "Data invoice berhasil ditarik.",
      data: responseData
    });

  } catch (error) {
    console.error("Error pada getInvoiceDetail:", error);
    return res.status(500).json({
      status: false,
      message: "Terjadi kesalahan internal server.",
      error: error.message
    });
  }
};