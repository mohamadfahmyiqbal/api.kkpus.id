// PATH: scripts/rollbackTestUser.js
import "dotenv/config";
import db from "../models/index.js";
import { syncFinancialSummary } from "../services/financialSummarySyncService.js";

/**
 * Script untuk me-rollback pendaftaran user test001@gmail.com
 * hingga tahap paling awal: Approval Pengawas PENDING (Step 1).
 */
async function rollbackTestUser() {
  const targetEmail = "test001@gmail.com";
  console.log(`\n======================================================`);
  console.log(`🔄 Memulai Rollback Pendaftaran ke Pengawas PENDING: ${targetEmail}`);
  console.log(`======================================================\n`);

  const t = await db.sequelize.transaction();

  try {
    // 1. Cari user di tabel Member
    const member = await db.Member.findOne({
      where: { email: targetEmail },
      transaction: t,
    });

    if (!member) {
      throw new Error(`Member dengan email ${targetEmail} tidak ditemukan di database.`);
    }

    const memberId = member.member_id;
    console.log(`✅ Member ditemukan: ID = ${memberId}, Nama = ${member.full_name}`);

    // 2. Cari pendaftaran terkait
    const registration = await db.MemberRegistration.findOne({
      where: { member_id: memberId },
      transaction: t,
    });

    if (!registration) {
      throw new Error(`Data pendaftaran (MemberRegistration) untuk member ID ${memberId} tidak ditemukan.`);
    }

    const registrationId = registration.registration_id;
    console.log(`✅ Registration ditemukan: ID = ${registrationId}`);

    // 3. Ambil approval flow untuk pendaftaran anggota
    const flow = await db.ApprovalFlow.findOne({
      where: { entity_ref: "member_registrations" },
      include: [
        {
          model: db.ApprovalStep,
          as: "steps",
          order: [["step_order", "ASC"]],
          include: [{ model: db.UserRole, as: "verifierRole" }],
        },
      ],
      transaction: t,
    });

    if (!flow || !flow.steps || flow.steps.length === 0) {
      throw new Error("ApprovalFlow untuk 'member_registrations' tidak ditemukan.");
    }

    console.log(`✅ Flow ditemukan: "${flow.flow_name}" dengan ${flow.steps.length} langkah`);
    flow.steps.forEach((s) => {
      console.log(`   - Step ${s.step_order}: ${s.step_name} (${s.verifierRole?.role_name || s.role_id}) [ID: ${s.approval_step_id}]`);
    });

    const step1Pengawas = flow.steps.find((s) => s.step_order === 1);
    const step2Ketua = flow.steps.find((s) => s.step_order === 2);
    const step3Bendahara = flow.steps.find((s) => s.step_order === 3);

    if (!step1Pengawas) {
      throw new Error("Langkah ke-1 (Pengawas) tidak ditemukan dalam flow pendaftaran.");
    }

    // 4. Hapus SELURUH record persetujuan di tabel EntityStepApproval untuk pendaftaran ini
    const allStepIds = flow.steps.map((s) => s.approval_step_id);
    await db.EntityStepApproval.destroy({
      where: {
        entity_id: registrationId,
        entity_ref: "members",
        approval_step_id: allStepIds,
      },
      transaction: t,
    });

    // 5. Hapus SELURUH log di tabel Approval untuk pendaftaran ini
    await db.Approval.destroy({
      where: {
        entity_id: registrationId,
        entity_ref: "members",
        approval_step_id: allStepIds,
      },
      transaction: t,
    });

    // 6. Reset MemberRegistration ke posisi awal (Step 1: Pengawas)
    await db.MemberRegistration.update(
      {
        final_status: "PENDING",
        current_step_id: step1Pengawas.approval_step_id,
      },
      {
        where: { registration_id: registrationId },
        transaction: t,
      }
    );

    // 7. Reset Member ke Calon Anggota
    const calonStatus = await db.MemberStatus.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { status_name: "Calon Anggota" },
          { status_name: "CALON_ANGGOTA" },
          { status_name: "Calon" },
        ],
      },
      transaction: t,
    });

    await db.Member.update(
      {
        is_registration_done: 0,
        member_type: "Calon Anggota",
        status_id: calonStatus ? calonStatus.status_id : undefined,
      },
      {
        where: { member_id: memberId },
        transaction: t,
      }
    );

    // 8. HAPUS SEMUA TAGIHAN: Bill & BillItems (Simpanan Pokok, Wajib, Sukarela, dll)
    const deletedItems = await db.BillItem.destroy({
      where: { member_id: memberId },
      transaction: t,
    });
    console.log(`🧹 ${deletedItems} item tagihan (bill_items) berhasil dihapus.`);

    const deletedBills = await db.Bill.destroy({
      where: { member_id: memberId },
      transaction: t,
    });
    console.log(`🧹 ${deletedBills} header tagihan (bills) berhasil dihapus.`);

    // 9. HAPUS SEMUA TRANSAKSI TERKAIT PENDAFTARAN & SETORAN AWAL
    const deletedTx = await db.Transaction.destroy({
      where: {
        member_id: memberId,
        [db.Sequelize.Op.or]: [
          { tx_category: ["MEMBER_REGISTRATION", "REGISTRATION", "SIMPANAN_POKOK", "SIMPANAN_WAJIB", "SIMPANAN_SUKARELA", "SETORAN_SIMPANAN"] },
          { payment_method: ["manual_transfer", "MANUAL_TRANSFER"] },
        ],
      },
      transaction: t,
    });
    console.log(`🧹 ${deletedTx} transaksi terkait pendaftaran/setoran dihapus.`);

    // 10. RESET SALDO REKENING SIMPANAN PADA TABEL ACCOUNTS
    const [updatedAccounts] = await db.Account.update(
      { current_balance: 0 },
      {
        where: {
          member_id: memberId,
          account_type: ["SW_POKOK", "SW_WAJIB", "SS_SUKARELA"],
        },
        transaction: t,
      }
    );
    console.log(`🧹 ${updatedAccounts} rekening simpanan pada tabel accounts di-reset ke saldo 0.`);

    // 11. RESET TABEL MEMBER_SAVINGS_ACCOUNTS (jika ada)
    await db.MemberSavingsAccount.update(
      { current_balance: 0, nominal: 0 },
      {
        where: { member_id: memberId },
        transaction: t,
      }
    );

    // 12. RESET MEMBER FINANCIAL SUMMARY
    await db.MemberFinancialSummary.update(
      {
        simpanan_pokok: 0,
        simpanan_wajib: 0,
        simpanan_sukarela: 0,
      },
      {
        where: { member_id: memberId },
        transaction: t,
      }
    );
    console.log(`🧹 Ringkasan keuangan (MemberFinancialSummary) di-reset ke 0.`);

    await t.commit();

    // Sync financial summary di luar transaksi
    try {
      await syncFinancialSummary(db.sequelize, memberId);
    } catch (e) {
      console.warn("Sync summary warning:", e.message);
    }

    console.log(`\n🎉 ROLLBACK KE PENGAWAS PENDING BERHASIL!`);
    console.log(`- Member           : ${member.full_name} (${targetEmail})`);
    console.log(`- Status Anggota   : Calon Anggota (is_registration_done = 0)`);
    console.log(`- Status Registrasi: PENDING`);
    console.log(`- Posisi Step      : Step 1 - ${step1Pengawas.step_name} (${step1Pengawas.verifierRole?.role_name || "Pengawas"})`);
    console.log(`- Pengawas Step 1  : MENUNGGU PERSETUJUAN (PENDING)`);
    console.log(`- Ketua Step 2     : Belum Diproses`);
    console.log(`- Bendahara Step 3 : Belum Diproses`);
    console.log(`- Tagihan          : Bersih (0 tagihan)`);
    console.log(`- Saldo Simpanan   : Rp 0\n`);

    process.exit(0);
  } catch (err) {
    await t.rollback();
    console.error(`\n❌ Gagal melakukan rollback:`, err.message);
    console.error(err);
    process.exit(1);
  }
}

rollbackTestUser();
