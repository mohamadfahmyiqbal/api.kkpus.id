// 📁 controllers/core/approvals/performFinalAction.js

import db from "../../../models/index.js";
// Asumsikan path ke createInitialBills sudah benar
import { createInitialBills } from "../../billing/createInitialBills.js";

/**
 * Melakukan tindakan spesifik entitas jika persetujuan mencapai langkah akhir (APPROVED).
 * Dipanggil dari processApproval.js
 *
 * @param {object} params
 * @param {string} params.entityRef - Referensi entitas ('member_registration', dll.)
 * @param {object} params.entity - Objek model entitas (e.g., MemberRegistration instance)
 * @param {object} params.transaction - Objek transaksi Sequelize (alias: t)
 */
// 🚨 FIX KRITIS: Menerima objek tunggal dan mendestrukturisasi properti
export const performFinalAction = async ({ entityRef, entity, transaction: t }) => {
 // CATATAN: Pembaruan final_status: "APPROVED" dan registration_status: "aktif"
 // sudah dilakukan di controller processApproval.js.
 // Kita fokus pada Logika Bisnis final.

 switch (entityRef) {
  // Pastikan case ini sama persis dengan yang ada di EntityModels di processApproval.js (lowercase)
  case 'member_registration': 
   // 1. Pindahkan/Update data ke tabel members
   // Ini mengaktifkan member di tabel members.
   await db.Member.update({
    full_name: entity.full_name,
    email: entity.email,
    phone_number: entity.phone_number,
    nik_ktp: entity.nik_ktp,
    address: entity.address_ktp,
    member_type: entity.member_type,
    join_date: new Date(),
    status_id: 1, // Asumsi 1 = Aktif
   }, { where: { member_id: entity.member_id }, transaction: t });

   // 2. Buat Tagihan (Menggunakan Modul Global Billing)
   // Ini adalah kewajiban awal anggota (simpanan pokok/wajib).
   await createInitialBills(entity.member_id, t);

   return `Pendaftaran disetujui penuh. Akun anggota berhasil diaktifkan dan tagihan awal dibuat.`;

  case 'financing_application':
   // Logika untuk Pembiayaan...
   await db.FinancingDisbursement.create({
    financing_id: entity.financing_id,
    disbursement_datetime: new Date(),
    amount: entity.required_amount,
    status: 'COMPLETED',
   }, { transaction: t });
   return `Aplikasi Pembiayaan disetujui dan Dana Disbursement berhasil dicatat.`;

  case 'savings_withdrawal':
   // Logika untuk Penarikan...
   await db.SavingsTransaction.create({
    savings_account_id: entity.savings_account_id,
    tx_type: 'WITHDRAWAL',
    amount: entity.amount,
    tx_datetime: new Date(),
    approved_status: 'APPROVED',
   }, { transaction: t });
   return `Penarikan Simpanan disetujui. Dana berhasil dicatat di Savings Transaction.`;

  default:
   return `Entitas ${entityRef} disetujui penuh. Tidak ada tindakan final tambahan yang terdefinisikan.`;
 }
};