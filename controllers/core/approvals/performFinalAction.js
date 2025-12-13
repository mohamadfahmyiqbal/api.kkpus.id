// 📁 controllers/core/approvals/performFinalAction.js (FINAL)

import db from "../../../models/index.js";
// 🚨 Pastikan path ini benar
import { createInitialBills } from "../../billing/createInitialBills.js";

/**
 * Melakukan tindakan spesifik entitas jika persetujuan mencapai langkah akhir (APPROVED).
 * @returns {object} Object: { message: string, billId: number | null }
 */
export const performFinalAction = async ({
  entityRef,
  entity,
  transaction: t,
}) => {
  switch (entityRef) {
    case "member_registration":
      // 1. Pindahkan/Update data ke tabel members
      await db.Member.update(
        {
          full_name: entity.full_name,
          email: entity.email,
          phone_number: entity.phone_number,
          nik_ktp: entity.nik_ktp,
          address: entity.address_ktp,
          member_type: entity.member_type,
          join_date: new Date(),
          status_id: 2, // ✅ Status 2: Pending Pembayaran/Terdaftar di tabel Members
        },
        { where: { member_id: entity.member_id }, transaction: t }
      );

      // 2. Buat Tagihan
      const newBillId = await createInitialBills(entity.member_id, t);

      const message = `Pendaftaran disetujui penuh. Akun anggota berhasil didaftarkan dengan status Menunggu Pembayaran. Tagihan awal telah dibuat.`;

      // Mengembalikan objek yang berisi message dan billId
      return { message, billId: newBillId };

    case "financing_application":
      await db.FinancingDisbursement.create(
        {
          financing_id: entity.financing_id,
          disbursement_datetime: new Date(),
          amount: entity.required_amount,
          status: "COMPLETED",
        },
        { transaction: t }
      );
      return {
        message: `Aplikasi Pembiayaan disetujui dan Dana Disbursement berhasil dicatat.`,
        billId: null,
      };

    case "savings_withdrawal":
      await db.SavingsTransaction.create(
        {
          savings_account_id: entity.savings_account_id,
          tx_type: "WITHDRAWAL",
          amount: entity.amount,
          tx_datetime: new Date(),
          approved_status: "APPROVED",
        },
        { transaction: t }
      );
      return {
        message: `Penarikan Simpanan disetujui. Dana berhasil dicatat di Savings Transaction.`,
        billId: null,
      };

    default:
      return {
        message: `Entitas ${entityRef} disetujui penuh. Tidak ada tindakan final tambahan yang terdefinisikan.`,
        billId: null,
      };
  }
};
