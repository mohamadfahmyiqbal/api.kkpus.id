import db from "../../../../models/index.js";
import { processDokuDisbursement } from "../../../savings/disburseWithdrawal.js";
import { sendGlobalNotification } from "../../../../services/notificationHelper.js";
import { syncFinancialSummary } from "../../../../services/financialSummarySyncService.js";
import { syncSavingsReportList } from "../../../../services/savingsReportSyncService.js";

const ACCOUNT_TYPE_MAP = {
  "Simpanan Sukarela": "SS_SUKARELA",
  "Simpanan Pokok": "SW_POKOK",
  "Simpanan Wajib": "SW_WAJIB",
};

/**
 * Final action handler for Savings Withdrawal approvals.
 */
export const handleSavingsWithdrawalFinalAction = async ({ entity, transaction: t }) => {
  const { SavingsWithdrawal, MemberSavingsAccount, Account } = db;

  console.log("[handleSavingsWithdrawalFinalAction] withdrawal entity:", {
    withdrawal_id: entity.withdrawal_id,
    savings_account_id: entity.savings_account_id,
    member_id: entity.member_id,
    amount: entity.amount,
    status: entity.status,
  });

  // 1. Kurangi saldo di member_savings_accounts atau member_saving_targets
  let account = null;

  if (entity.savings_account_id) {
    account = await MemberSavingsAccount.findOne({
      where: { savings_account_id: entity.savings_account_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (account) {
      const newBalance = parseFloat(account.current_balance) - parseFloat(entity.amount);
      if (newBalance < 0) {
        throw new Error("Saldo tidak mencukupi untuk penarikan.");
      }
      await MemberSavingsAccount.update(
        { current_balance: newBalance },
        { where: { savings_account_id: entity.savings_account_id }, transaction: t }
      );
    }
  } else if (entity.member_saving_target_id) {
    const targetAccount = await db.MemberSavingTarget.findOne({
      where: { member_saving_target_id: entity.member_saving_target_id },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (targetAccount) {
      const newBalance = parseFloat(targetAccount.current_balance) - parseFloat(entity.amount);
      if (newBalance < 0) {
        throw new Error("Saldo tabungan tidak mencukupi untuk penarikan.");
      }

      const targetStatus = newBalance <= 0 ? "COMPLETED" : targetAccount.status;

      await db.MemberSavingTarget.update(
        { current_balance: newBalance, status: targetStatus },
        { where: { member_saving_target_id: entity.member_saving_target_id }, transaction: t }
      );
    }
  }

  // 2. Kurangi saldo di tabel Account (ledger per kategori)
  const targetAccountType = account ? (ACCOUNT_TYPE_MAP[account.account_type] || account.account_type) : null;

  if (targetAccountType) {
    const typeAccount = await Account.findOne({
      where: { member_id: entity.member_id, account_type: targetAccountType },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (typeAccount) {
      const newTypeBalance = parseFloat(typeAccount.current_balance) - parseFloat(entity.amount);
      await Account.update(
        { current_balance: newTypeBalance },
        { where: { account_id: typeAccount.account_id }, transaction: t }
      );
    }
  }

  // 3. Kurangi saldo total di Account (SAVINGS)
  const mainAccount = await Account.findOne({
    where: { member_id: entity.member_id, account_type: "SAVINGS" },
    transaction: t,
    lock: t.LOCK.UPDATE,
  });
  if (mainAccount) {
    const newMainBalance = parseFloat(mainAccount.current_balance) - parseFloat(entity.amount);
    await Account.update(
      { current_balance: newMainBalance },
      { where: { account_id: mainAccount.account_id }, transaction: t }
    );
  }

  // 4. Update status withdrawal
  await SavingsWithdrawal.update(
    {
      status: "READY_TO_PAY",
      approved_at: new Date(),
      is_approved_bendahara: true,
    },
    { where: { withdrawal_id: entity.withdrawal_id }, transaction: t }
  );

  // 5. Tambahkan record PENARIKAN ke tabel Transaction agar masuk ke perhitungan summary keuangan
  await db.Transaction.create(
    {
      member_id: entity.member_id,
      midtrans_order_id: `WD-${entity.withdrawal_id}-${Date.now()}`,
      tx_type: "PENARIKAN",
      tx_category: ACCOUNT_TYPE_MAP[account?.account_type] || account?.account_type || "PENARIKAN_SIMPANAN",
      amount: entity.amount,
      status: "PAID",
      settlement_time: new Date(),
    },
    { transaction: t }
  );

  // 6. Hook afterCommit untuk sync reports & auto disbursement
  t.afterCommit(async () => {
    try {
      await syncFinancialSummary(db.sequelize, entity.member_id);
      await syncSavingsReportList(db.sequelize);
    } catch (err) {
      console.error("[handleSavingsWithdrawalFinalAction] syncFinancialSummary failed:", err.message);
    }

    if (entity.method === "TRANSFER") {
      try {
        console.log(`[handleSavingsWithdrawalFinalAction] Memicu auto-disbursement DOKU untuk penarikan ${entity.withdrawal_id}`);
        const disburseRes = await processDokuDisbursement(entity.withdrawal_id);
        console.log(`[handleSavingsWithdrawalFinalAction] Auto-disbursement DOKU berhasil:`, disburseRes);
      } catch (err) {
        console.error("[handleSavingsWithdrawalFinalAction] Auto-disbursement via DOKU gagal:", err.message);
      }
    } else {
      console.log(`[handleSavingsWithdrawalFinalAction] Metode penarikan adalah TUNAI, DOKU disbursement dilewati.`);
    }

    // Notify member that withdrawal was approved
    sendGlobalNotification({
      memberId: entity.member_id,
      title: "Penarikan Disetujui!",
      content: `Penarikan sebesar Rp ${(parseFloat(entity.amount) || 0).toLocaleString("id-ID")} telah disetujui dan sedang diproses.`,
      type: "APPROVAL",
      url: "/",
    }).catch((err) => console.error("[handleSavingsWithdrawalFinalAction] Withdrawal notification failed:", err.message));
  });
};
