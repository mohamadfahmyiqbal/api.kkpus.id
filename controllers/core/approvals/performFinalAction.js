// 📁 controllers/core/approvals/performFinalAction.js

import db from "../../../models/index.js";
import { createInitialBills } from "../../billing/createInitialBills.js";

/**
 * Melakukan tindakan final setelah approval disetujui sepenuhnya.
 */
export const performFinalAction = async ({
  entityRef,
  entity,
  transaction: t,
}) => {
  switch (entityRef) {
    case "member_registration":
      // 1. Update data Member menjadi status 'Pending Pembayaran'
      await db.Member.update(
        {
          full_name: entity.full_name,
          email: entity.email,
          phone_number: entity.phone_number,
          nik_ktp: entity.nik_ktp,
          address: entity.address_ktp,
          member_type: entity.member_type,
          join_date: new Date(),
          status_id: 2, // Terdaftar, menunggu pembayaran
        },
        { where: { member_id: entity.member_id }, transaction: t }
      );

      // 2. Generate Tagihan Awal melalui createInitialBills
      const newBillId = await createInitialBills(entity.member_id, t);

      return {
        message: "Pendaftaran disetujui. Tagihan awal telah dibuat.",
        billId: newBillId,
      };

    case "financing_application":
      // Mencatat pencairan pembiayaan ke tabel transactions (PENARIKAN/KELUAR)
      await db.Transaction.create(
        {
          member_id: entity.member_id,
          amount: entity.required_amount,
          tx_type: "PENARIKAN",
          tx_category: "LOAN_DISBURSEMENT",
          status: "PAID",
          is_ledger_recorded: true,
          settlement_time: new Date(),
          status_message: "Pencairan Pembiayaan Disetujui",
        },
        { transaction: t }
      );

      return {
        message: "Pembiayaan disetujui dan dana dicatat sebagai pengeluaran.",
        billId: null,
      };

    case "savings_withdrawal":
      // Mencatat penarikan simpanan ke tabel transactions
      await db.Transaction.create(
        {
          member_id: entity.member_id,
          amount: entity.amount,
          tx_type: "PENARIKAN",
          tx_category: "SAVINGS_WITHDRAWAL",
          status: "PAID",
          is_ledger_recorded: true,
          settlement_time: new Date(),
          status_message: "Penarikan Simpanan Disetujui",
        },
        { transaction: t }
      );

      // Kurangi saldo di tabel accounts secara sinkron
      await db.Account.decrement("current_balance", {
        by: entity.amount,
        where: { member_id: entity.member_id, account_type: "SAVINGS" },
        transaction: t,
      });

      return {
        message: "Penarikan disetujui. Saldo akun telah didebit.",
        billId: null,
      };

    default:
      return {
        message: `Entitas ${entityRef} disetujui tanpa aksi finansial.`,
        billId: null,
      };
  }
};
