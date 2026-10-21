import db from "../../../models/index.js";
import { v4 as uuidv4 } from "uuid";
import { prepareBillItems } from "../../../services/billingHelper.js";
import { broadcastApprovalNotification } from "../../../utils/socket.js";

const { Bill, BillItem, Transaction, Member, CooperativeBankAccount } = db;

/**
 * Controller bagi anggota untuk mengunggah bukti transfer manual
 */
export const submitManualPayment = async (req, res) => {
  let dbTransaction;
  try {
    if (!req.userId) {
      return res.status(401).json({ status: false, message: "Autentikasi gagal." });
    }

    const {
      bill_id,
      bill_item_ids,
      amount,
      tx_category,
      financing_id,
      bank_id,
      sender_name,
      sender_bank,
      sender_account_no,
    } = req.body;

    const proofFile = req.file;
    if (!proofFile) {
      return res.status(400).json({
        status: false,
        message: "Bukti transfer pembayaran wajib diunggah.",
      });
    }

    const proofUrl = `/uploads/payment-proofs/${proofFile.filename}`;

    dbTransaction = await db.sequelize.transaction();

    // Validasi Member
    const member = await Member.findByPk(req.userId, { transaction: dbTransaction });
    if (!member) throw new Error("Data anggota tidak ditemukan.");

    // Validasi Rekening Koperasi Terpilih jika disertakan
    let coopBank = null;
    if (bank_id) {
      coopBank = await CooperativeBankAccount.findByPk(bank_id, { transaction: dbTransaction });
    }

    let targetBillId = bill_id;
    let finalGross = parseFloat(amount || 0);

    const parsedItemIds = Array.isArray(bill_item_ids)
      ? bill_item_ids
      : typeof bill_item_ids === "string"
      ? (() => {
          try {
            return JSON.parse(bill_item_ids);
          } catch (e) {
            return [bill_item_ids];
          }
        })()
      : [];

    // Jika belum ada bill_id (misalnya pembayaran pertama kali dari bill_item_ids)
    if (!targetBillId) {
      const { total_gross, final_bill_item_ids, bill_type_id } = await prepareBillItems({
        tx_category,
        bill_item_ids: parsedItemIds,
        amount: finalGross,
        financing_id,
        member,
        dbTransaction,
      });

      finalGross = total_gross;

      const newBillHeader = await Bill.create(
        {
          bill_id: uuidv4(),
          member_id: member.member_id,
          member_no: member.member_no,
          bill_type_id,
          amount: finalGross,
          status: "pending_verification",
          description: `${tx_category || "Tagihan"} #${member.member_no}`,
          due_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        { transaction: dbTransaction }
      );

      targetBillId = newBillHeader.bill_id;

      await BillItem.update(
        { bill_id: targetBillId },
        { where: { bill_item_id: final_bill_item_ids }, transaction: dbTransaction }
      );
    } else {
      // Update status bill eksisting
      await Bill.update(
        { status: "pending_verification" },
        { where: { bill_id: targetBillId }, transaction: dbTransaction }
      );
    }

    const targetFinancingId =
      financing_id ||
      (Array.isArray(parsedItemIds) && parsedItemIds[0] && String(parsedItemIds[0]).startsWith("dp-")
        ? String(parsedItemIds[0]).replace(/^dp-/, "")
        : null);

    if (targetFinancingId && proofUrl) {
      await db.FinancingApplication.update(
        { transfer_proof_path: proofUrl },
        { where: { financing_id: targetFinancingId }, transaction: dbTransaction }
      );
    }

    const orderId = `MANUAL-${targetBillId.substring(0, 8)}-${Date.now()}`;

    // Buat Log Transaksi
    const tx = await Transaction.create(
      {
        member_id: member.member_id,
        bill_id: targetBillId,
        midtrans_order_id: orderId,
        amount: finalGross,
        status: "PENDING_VERIFICATION",
        tx_type: "SETORAN",
        tx_category: tx_category || "SETORAN_MANUAL",
        payment_type: "manual_transfer",
        payment_method: coopBank ? coopBank.bank_code : sender_bank || "TRANSFER_MANUAL",
        bank_name: coopBank ? coopBank.bank_name : sender_bank || null,
        proof_of_transfer: proofUrl,
        sender_name: sender_name || member.full_name,
        sender_bank: sender_bank || null,
        sender_account_no: sender_account_no || null,
        is_ledger_recorded: false,
      },
      { transaction: dbTransaction }
    );

    await dbTransaction.commit();

    // Broadcast ke antrian persetujuan admin secara real-time
    broadcastApprovalNotification({
      type: "MANUAL_PAYMENT",
      title: "Setoran / Pembayaran Manual Baru",
      message: `${member.full_name} telah mengunggah bukti transfer sebesar Rp ${Number(finalGross).toLocaleString("id-ID")}.`,
      data: {
        transaction_id: tx.transaction_id,
        bill_id: targetBillId,
        member_id: member.member_id,
        amount: finalGross,
      },
    });

    return res.status(200).json({
      status: true,
      message: "Bukti pembayaran berhasil diunggah dan sedang diverifikasi oleh admin.",
      data: {
        transaction_id: tx.transaction_id,
        order_id: orderId,
        bill_id: targetBillId,
        proof_url: proofUrl,
        status: "PENDING_VERIFICATION",
      },
    });
  } catch (error) {
    if (dbTransaction) await dbTransaction.rollback();
    console.error("SUBMIT_MANUAL_PAYMENT_ERROR:", error);
    return res.status(500).json({
      status: false,
      message: error.message || "Gagal mengunggah bukti pembayaran.",
    });
  }
};
