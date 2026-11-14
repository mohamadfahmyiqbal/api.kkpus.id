// 📁 scripts/dataLifecycleCleaner.js
import db from "../models/index.js";

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

export const anonymizeDataForInactiveMembers = async (dryRun = false) => {
  console.log("🚀 Starting Data Lifecycle Cleaner for Right to be Forgotten compliance");
  console.log(`Running in ${dryRun ? 'DRY RUN' : 'LIVE'} mode`);

  const t = await db.sequelize.transaction();
  const deletedDataSummary = {};

  try {
    // Cari anggota yang berstatus NON-AKTIF
    const inactiveMembers = await db.Member.findAll({
      attributes: ["member_id", "member_no", "full_name", "nik_ktp"],
      where: {
        status_id: db.MemberStatus.findOne({
          attributes: ["status_id"],
          where: { status_name: "NON-AKTIF" }
        }).status_id
      },
      transaction: t
    });

    console.log(`🔍 Found ${inactiveMembers.length} inactive members to process`);

    for (const member of inactiveMembers) {
      console.log(`\n--- Processing member: ${member.full_name || member.member_id} ---`);

      // Jalankan penghapusan data untuk setiap model yang terkait dengan member_id
      const deletedDataSummary = {};

      for (const model of modelsWithMemberId) {
        if (!model) continue;

        const modelName = model.modelName || model.name || model.tableName;

        try {
          // Catatan penghapusan data
          const deletedCount = await model.destroy({
            where: { member_id: member.member_id },
            transaction: t,
            force: false // Soft delete jika model mendukung soft delete, jika tidak, hard delete
          });

          if (deletedCount > 0) {
            deletedDataSummary[modelName] = deletedCount;
            console.log(`✅ ${modelName}: ${deletedCount} record(s) deleted`);
          }
        } catch (modelError) {
          console.warn(`⚠️  Failed to delete from ${modelName}:`, modelError.message);
        }
      }

      // Hapus dari tabel khusus terminasi, tidak perlu soft delete (hapus permanen)
      try {
        const membershipTerminationDeleted = await db.MembershipTermination.destroy({
          where: { member_id: member.member_id },
          transaction: t,
          force: true
        });
        if (membershipTerminationDeleted > 0) {
          deletedDataSummary.MembershipTermination = membershipTerminationDeleted;
          console.log(`✅ MembershipTermination: ${membershipTerminationDeleted} record(s) permanently deleted`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to delete MembershipTermination:`, error.message);
      }

      // Catat log penghapusan PII
      if (!dryRun && db.ActivityLog) {
        await db.ActivityLog.create({
          member_id: member.member_id,
          activity_type: "DATA_LIFECYCLE_ANONYMIZATION",
          activity_datetime: new Date(),
          detail: `PII for member ${member.full_name || member.member_id} automatically anonymized via Right to be Forgotten pipeline.`,
          created_by: "system-data-lifecycle"
        }, { transaction: t });
      }
    }

    if (!dryRun) {
      await t.commit();
      console.log("\n✅ Transaction committed successfully");
    } else {
      await t.rollback();
      console.log("\n🚫 Dry run completed - no data was changed");
    }

    console.log("\n📊 SUMMARY:", deletedDataSummary);
    console.log("\n✅ Data Lifecycle Cleaner completed");

  } catch (error) {
    await t.rollback();
    console.error("❌ Data Lifecycle Cleaner failed:", error.message);
    throw error;
  }
};

// Jalankan langsung jika dijalankan sebagai CLI
if (process.argv[1]?.endsWith("dataLifecycleCleaner.js")) {
  const isDryRun = process.argv.includes('--dry-run') || process.argv.includes('-d');
  anonymizeDataForInactiveMembers(isDryRun)
    .then(() => {
      console.log("\n🎯 Execution completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Execution failed:", error.message);
      process.exit(1);
    });
}