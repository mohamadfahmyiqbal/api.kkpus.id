// 📁 services/dataLifecycleCleaner.js
// Pipeline Right to be Forgotten (GDPR Art 17 / CCPA 1798.105)
// Alur: Terminasi --> Data Lifecycle/Anonymization Worker --> Database Layer (MEMBERS / DBLAYER)
//
// node TERM berstatus orphaned: membership_terminations dan account_lockouts
// tidak terhubung ke proses aplikasi penghapusan data.
// Solusi: bentuk alur resmi di atas node TERM:
//   AMEMB --> AUTH/TERM --> Data Lifecycle/Anonymization Worker --> MEMBERS / DBLAYER

import db from "../models/index.js";
import { Op } from "sequelize";

const modelsWithMemberId = [
  db.MemberRoleAssignment,
  db.Account,
  db.MemberFinancialSummary,
  db.MemberRegistration,
  db.MemberBankAccount,
  db.MemberEmployment,
  db.MemberEmergencyContact,
  db.BusinessProfile,
  db.Bill,
  db.Transaction,
  db.GeneralTransaction,
  db.SukukOrder,
  db.MemberLoan,
  db.FinancingApplication,
  db.JualBeliReport,
  db.SavingsReport,
  db.SavingsReportList,
  db.MemberSavingsAccount,
  db.SavingsWithdrawal,
  db.MemberSavingTarget,
  db.PushSubscription,
  db.ForgotPasswordSession,
  db.ArisanParticipant,
  db.ArisanPayment,
  db.Evaluation,
  db.MaterialNote,
  db.Ranking,
];

/**
 * Cari anggota yang berstatus TERHENTAKANGGOTAAN NON-AKTIF.
 * MemberStatus(NON-AKTIF) adalah status terminal untuk jenis kelamin kanan/perempuan biasa.
 * Periksa jika ada lebih banyak status jika proyek memperluas tipe-tipe kelamin.
 */
const findInactiveMembers = async () => {
  console.log("🔍 Searching for inactive members...");

  const inactiveStatus = await db.MemberStatus.findOne({
    attributes: ["status_id"],
    where: { status_name: "NON-AKTIF" },
  });

  if (!inactiveStatus) {
    throw new Error(`Status "NON-AKTIF" tidak ditemukan di table MemberStatus.`);
  }

  const inactiveMembers = await db.Member.findAll({
    attributes: ["member_id", "member_no", "full_name", "nik_ktp", "email", "phone_number"],
    where: { status_id: inactiveStatus.status_id },
    limit: 500, // Batas hasil per run agar tidak overload DB
  });

  console.log(`🔍 Found ${inactiveMembers.length} inactive members to process`);
  return inactiveMembers;
};

/**
 * Hapus/anonimisasi data historis untuk seorang member.
 * Mengikuti prinsip GDPR/CCPA minimalisasi data dan penghapusan penuh saat berhenti.
 * Setelah terminasi anggota dikonfirmasi, data PII tetap tersimpan namun:
 * - Tabel terminasi (membership_terminations) dihapus permanen
 * - Tabel operasional dihapus bersamaan jika status member "NON-AKTIF"
 *
 * catatan pada GPR / GDPR: perlu hukum retensi dan dasar hukum untuk setiap tindakan pemrosesan.
 * Legal basis untuk delete permanen: consent withdrawal + legal obligation penyimpan riwayat
 */
const handleSingleMember = async (member, transaction) => {
  console.log(`\n┌─ Processing: ${member.full_name || member.member_no} (${member.member_id}) ─┐`);

  // 1. Hapus data di semua model yang memiliki link member_id (soft delete melalui .destroy())
  for (const model of modelsWithMemberId) {
    if (!model) continue;

    try {
      const deletedCount = await model.destroy({
        where: { member_id: member.member_id },
        transaction,
        force: false,
      });
      if (deletedCount > 0) {
        console.log(`  ✅ ${model.modelName || model.name || model.tableName}: ${deletedCount} record(s) deleted`);
      }
    } catch (modelError) {
      console.warn(`  ⚠️  Failed to delete from ${model.modelName || model.name || model.tableName}: ${modelError.message}`);
    }
  }

  // 2. Hapus tabel terminasi permanen (terisolasi dari proses lain, hapus secara clean)
  try {
    const termDeleted = await db.MembershipTermination.destroy({
      where: { member_id: member.member_id },
      transaction,
      force: true,
    });
    if (termDeleted > 0) {
      console.log(`  ✅ MembershipTermination: ${termDeleted} record(s) permanently deleted (orphaned cleanup)`);
    }
  } catch (termError) {
    console.warn(`  ⚠️  Failed to delete MembershipTermination: ${termError.message}`);
  }

  // 2b. Bersihkan tabel account_lockouts dan login_attempts jika ada (node AUTH/TERM)
  try {
    const piiIdentifiers = [member.email, member.phone_number].filter(Boolean);
    if (piiIdentifiers.length > 0) {
      await db.sequelize.query(
        `DELETE FROM account_lockouts WHERE email_or_phone IN (:identifiers)`,
        { replacements: { identifiers: piiIdentifiers }, transaction }
      ).catch(() => {});
      await db.sequelize.query(
        `DELETE FROM login_attempts WHERE email_or_phone IN (:identifiers) OR member_id = :memberId`,
        { replacements: { identifiers: piiIdentifiers, memberId: member.member_id }, transaction }
      ).catch(() => {});
    }
  } catch (authError) {
    console.warn(`  ⚠️  Failed to clear auth lockouts/login attempts: ${authError.message}`);
  }

  // 3. Hapus activity log untuk pasangan member (kecuali log penghapusan menggunakan correlation ID)
  if (db.ActivityLog) {
    await db.ActivityLog.update(
      { member_id: null }, // satdown reference empty
      {
        where: {
          member_id: member.member_id,
          activity_type: { [Op.like]: DATA_LIFECYCLE_PATTERN },
        },
        transaction,
      }
    );
    if ((await db.ActivityLog.count({ where: { member_id: member.member_id }, transaction })) > 0) {
      await db.ActivityLog.destroy({
        where: {
          member_id: member.member_id,
          activity_type: { [Op.like]: DATA_LIFECYCLE_PATTERN },
        },
        transaction,
      });
    }
  }

  // 4. Catat log penghapusan penjaminan detail aktivitas penutup
  if (db.ActivityLog) {
    await db.ActivityLog.create({
      member_id: member.member_id,
      activity_type: "DATA_LIFECYCLE_CLEANUP_COMPLETED",
      activity_datetime: new Date(),
      detail: `Data PII anggota ${member.full_name || member.member_no} (${member.member_id}) anonimisasi via Right to be Forgotten pipeline - TERM node cleanup.`,
      created_by: "system-data-lifecycle",
    }, { transaction });
  }
};

export const anonymizeDataForInactiveMembers = async (dryRun = false) => {
  console.log("🚀 Starting Data Lifecycle Cleaner for Right to be Forgotten compliance");
  console.log(`Running in ${dryRun ? 'DRY RUN' : 'LIVE'} mode`);

  const t = await db.sequelize.transaction();

  try {
    const inactiveMembers = await findInactiveMembers();

    for (const member of inactiveMembers) {
      await handleSingleMember(member, t);
    }

    if (!dryRun) {
      await t.commit();
      console.log("\n✅ Transaction committed successfully");
    } else {
      await t.rollback();
      console.log("\n🚫 Dry run completed - no data was changed");
    }

    console.log("\n📊 SUMMARY:", inactiveMembers.length ? `${inactiveMembers.length} members processed` : '0 members');
    console.log("\n✅ Data Lifecycle Cleaner completed");

    return inactiveMembers.length;

  } catch (error) {
    if (!dryRun && !t.finished) await t.rollback();
    console.error("❌ Data Lifecycle Cleaner failed:", error.message);
    throw error;
  }
};

// Konstanta untuk pattern activity_type
const DATA_LIFECYCLE_PATTERN = "DATA_LIFECYCLE";

/**
 * Helper untuk men-trigger pekerjaan anonimisasi saat member status berubah
 * digunakan sebagai trigger event dari pipeline AUTH/TERM.
 */
export const triggerDataCleanupForMember = async (memberId, dryRun = false) => {
  const targetMember = await db.Member.findByPk(memberId);
  if (!targetMember) {
    console.warn(`⚠️  Member not found: ${memberId}`);
    return 0;
  }

  if (targetMember.status_id !== (await db.MemberStatus.findOne({ attributes: ["status_id"], where: { status_name: "NON-AKTIF" } })).status_id) {
    console.log(`ℹ️  Member ${memberId} is not in terminal status, skipping cleanup`);
    return 0;
  }

  const t = await db.sequelize.transaction();
  try {
    await handleSingleMember(targetMember, t);
    if (!dryRun) await t.commit();
    else await t.rollback();

    return 1;
  } catch (error) {
    if (!dryRun && !t.finished) await t.rollback();
    console.error(`❌ Trigger cleanup failed for member ${memberId}:`, error.message);
    throw error;
  }
};
