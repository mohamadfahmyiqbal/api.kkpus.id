import db from "../../models/index.js";
import { initiateMidtransDisbursement } from "../utility/midtransDisbursement.js";

export const processMidtransDisbursement = async (withdrawal_id) => {
  const t = await db.sequelize.transaction();

  try {
    const wd = await db.SavingsWithdrawal.findByPk(withdrawal_id, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!wd || (wd.status !== "READY_TO_PAY" && wd.status !== "APPROVED")) {
      throw new Error("Penarikan tidak ditemukan atau belum siap untuk pencairan.");
    }

    const member = await db.Member.findByPk(wd.member_id, { transaction: t });

    const midtransResult = await initiateMidtransDisbursement(
      {
        withdrawalId: withdrawal_id,
        amount: parseFloat(wd.amount),
        memberId: wd.member_id,
        memberName: member?.name || "Member",
        bankAccount: {
          bank: wd.bank_name,
          accountNumber: wd.bank_account_no,
        },
      },
      t
    );

    const isSuccess = midtransResult.status === "success";
    const newStatus = isSuccess ? "PENDING_EXTERNAL" : "FAILED_REQUEST";

    await wd.update(
      {
        status: newStatus,
        midtrans_transaction_id: midtransResult.transaction_id,
      },
      { transaction: t }
    );

    await t.commit();
    return { success: true, midtransResult };
  } catch (error) {
    throw error;
  }
};

export const disburseWithdrawal = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const { entityId } = req.params;
    if (!entityId) throw new Error("ID Penarikan diperlukan.");

    const wd = await db.SavingsWithdrawal.findByPk(entityId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!wd) {
      throw new Error("Penarikan tidak ditemukan.");
    }

    if (wd.status === "DISBURSED") {
      throw new Error("Penarikan sudah selesai diproses dan telah dicairkan.");
    }

    if (wd.status !== "READY_TO_PAY") {
      throw new Error("Penarikan belum siap untuk pencairan. Status saat ini: " + wd.status);
    }

    // Note: Saldo sudah dikurangi saat approval bendahara di performFinalAction.js
    // Jangan kurangi lagi di sini untuk menghindari double deduction

    let result;
    if (wd.method === "TUNAI") {
      // For cash disbursement, just update status
      await wd.update(
        {
          status: "DISBURSED",
          disbursed_at: new Date(),
        },
        { transaction: t }
      );
      result = { success: true, message: "Pembayaran tunai berhasil dikonfirmasi." };
    } else if (wd.method === "TRANSFER") {
      // For bank transfer, use Midtrans
      result = await processMidtransDisbursement(entityId, t);
    } else {
      throw new Error("Metode pembayaran tidak valid.");
    }

    await t.commit();
    res.json({
      success: true,
      message: wd.method === "TUNAI" ? "Pembayaran tunai berhasil dikonfirmasi." : "Disbursement diproses, menunggu konfirmasi bank.",
      data: result,
    });
  } catch (error) {
    if (t) await t.rollback();
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};