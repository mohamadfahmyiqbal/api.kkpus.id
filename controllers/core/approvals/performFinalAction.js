import db from "../../../models/index.js";
import { createInitialBills } from "../../billing/createInitialBills.js";

export const performFinalAction = async ({ entityRef, entity, transaction: t }) => {
  switch (entityRef) {
    case "member_registration":
      await db.Member.update({ status_id: 1, join_date: new Date() }, { where: { member_id: entity.member_id }, transaction: t });
      const typeCodes = ["SW_POKOK", "SW_WAJIB"];
      await createInitialBills(entity.member_id, typeCodes, null, t);
      return { message: "Pendaftaran selesai." };

    case "savings_withdrawal":
      // A. Validasi Saldo (Double Check)
      const account = await db.MemberSavingsAccount.findByPk(entity.savings_account_id, { transaction: t });
      if (parseFloat(account.current_balance) < parseFloat(entity.amount)) {
        throw new Error("Saldo anggota tidak mencukupi saat proses pencairan.");
      }

      // B. Catat Mutasi Transaksi
      await db.Transaction.create({
        member_id: entity.member_id,
        amount: entity.amount,
        tx_type: "PENARIKAN",
        tx_category: "SAVINGS_WITHDRAWAL",
        status: "PAID",
        settlement_time: new Date(),
        status_message: "Dibayarkan oleh Bendahara",
      }, { transaction: t });

      // C. Potong Saldo Akun Induk & Akun Produk
      await db.Account.decrement("current_balance", {
        by: entity.amount,
        where: { member_id: entity.member_id, account_type: "SAVINGS" },
        transaction: t,
      });

      await db.MemberSavingsAccount.decrement("current_balance", {
        by: entity.amount,
        where: { savings_account_id: entity.savings_account_id },
        transaction: t,
      });

      return { message: "Saldo berhasil dipotong." };

    default:
      return { message: "Aksi selesai." };
  }
};