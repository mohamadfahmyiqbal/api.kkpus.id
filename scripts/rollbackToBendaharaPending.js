// PATH: scripts/rollbackToBendaharaPending.js
import "dotenv/config";
import db from "../models/index.js";

/**
 * Script untuk me-rollback pengajuan Jual Beli / Pembiayaan
 * sampai ke tahap: Menunggu Persetujuan Bendahara (Step 3 Pending).
 * 
 * Penggunaan:
 *   node scripts/rollbackToBendaharaPending.js [financing_id]
 * Jika financing_id tidak diisi, script akan otomatis mengambil pengajuan Jual Beli terakhir.
 */
async function rollbackToBendaharaPending() {
  const targetId = process.argv[2] || null;

  console.log(`\n======================================================`);
  console.log(`🔄 Memulai Rollback Pengajuan ke Bendahara PENDING`);
  console.log(`======================================================\n`);

  const t = await db.sequelize.transaction();

  try {
    let app = null;

    if (targetId) {
      app = await db.FinancingApplication.findByPk(targetId, {
        include: [{ model: db.Member, as: "member" }],
        transaction: t,
      });
      if (!app) {
        throw new Error(`FinancingApplication dengan ID ${targetId} tidak ditemukan.`);
      }
    } else {
      // Cari pengajuan Jual Beli / Pembiayaan terakhir
      app = await db.FinancingApplication.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { category: "Jual Beli" },
            { category: "Kendaraan" },
            { category: "Elektronik" },
            { category: "Barang" },
          ],
        },
        order: [["created_at", "DESC"]],
        include: [{ model: db.Member, as: "member" }],
        transaction: t,
      });

      if (!app) {
        // Fallback: ambil pengajuan pembiayaan apapun yang terakhir
        app = await db.FinancingApplication.findOne({
          order: [["created_at", "DESC"]],
          include: [{ model: db.Member, as: "member" }],
          transaction: t,
        });
      }
    }

    if (!app) {
      throw new Error("Tidak ada data pengajuan pembiayaan yang ditemukan di database.");
    }

    console.log(`📋 Pengajuan Ditemukan:`);
    console.log(`   ID           : ${app.financing_id}`);
    console.log(`   Kategori     : ${app.category}`);
    console.log(`   Barang       : ${app.item_name || app.purpose || "-"}`);
    console.log(`   Pemohon      : ${app.member?.full_name || app.nama_nasabah || "Anggota"} (${app.member_id})`);
    console.log(`   Harga/Plafon : Rp ${Number(app.item_price || app.amount_requested || 0).toLocaleString("id-ID")}`);
    console.log(`   DP           : Rp ${Number(app.down_payment || 0).toLocaleString("id-ID")}`);
    console.log(`   Status Saat Ini : ${app.status}`);

    // 1. Ambil Flow & Steps
    const flowId = app.approval_flow_id;
    if (!flowId) {
      throw new Error(`Pengajuan ${app.financing_id} tidak memiliki approval_flow_id.`);
    }

    const flow = await db.ApprovalFlow.findByPk(flowId, {
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
      throw new Error(`ApprovalFlow ID ${flowId} tidak ditemukan atau belum memiliki langkah persetujuan.`);
    }

    console.log(`\n🔍 Alur Persetujuan: ${flow.flow_name}`);
    flow.steps.forEach((s) => {
      console.log(`   Step ${s.step_order}: ${s.step_name} (${s.verifierRole?.role_name || "Role " + s.role_id})`);
    });

    // Cari step Bendahara (biasanya step terakhir atau step_order 3)
    const bendaharaStep =
      flow.steps.find((s) => (s.verifierRole?.role_name || "").toLowerCase().includes("bendahara")) ||
      flow.steps.find((s) => s.step_order === 3) ||
      flow.steps[flow.steps.length - 1];

    if (!bendaharaStep) {
      throw new Error("Langkah persetujuan Bendahara tidak ditemukan pada alur ini.");
    }

    console.log(`\n🎯 Target Step Rollback: Step ${bendaharaStep.step_order} - ${bendaharaStep.step_name} (ID: ${bendaharaStep.approval_step_id})`);

    // 2. Hapus BillItem yang telah diterbitkan (karena pencairan/approval bendahara dibatalkan)
    const deletedBills = await db.BillItem.destroy({
      where: { financing_application_id: app.financing_id },
      transaction: t,
    });
    console.log(`🗑️  Tagihan (BillItem) Dihapus: ${deletedBills} tagihan (termasuk DP dan cicilan)`);

    // 3. Hapus keputusan persetujuan Bendahara di tabel Approval & EntityStepApproval
    const deletedApprovals = await db.Approval.destroy({
      where: {
        entity_id: app.financing_id,
        approval_step_id: bendaharaStep.approval_step_id,
      },
      transaction: t,
    });

    const deletedEntityStep = await db.EntityStepApproval.destroy({
      where: {
        entity_id: app.financing_id,
        approval_step_id: bendaharaStep.approval_step_id,
      },
      transaction: t,
    });
    console.log(`🔄 Keputusan Bendahara Direset:`);
    console.log(`   - Data Approval dihapus: ${deletedApprovals}`);
    console.log(`   - Data EntityStepApproval dihapus: ${deletedEntityStep}`);

    // 4. Pastikan Step sebelum Bendahara (Pengawas & Ketua) tetap disetujui
    const previousSteps = flow.steps.filter((s) => s.step_order < bendaharaStep.step_order);
    for (const prev of previousSteps) {
      await db.EntityStepApproval.upsert(
        {
          entity_id: app.financing_id,
          entity_ref: flow.entity_ref || "financing_applications",
          approval_step_id: prev.approval_step_id,
          is_approved: 1,
          approved_at: new Date(),
        },
        { transaction: t }
      );
    }
    console.log(`✅ Langkah Sebelumnya (${previousSteps.map((p) => p.step_name).join(", ")}) dipastikan tetap APPROVED`);

    // 5. Update FinancingApplication ke PENDING pada Step Bendahara
    await db.FinancingApplication.update(
      {
        status: "PENDING",
        current_step_id: bendaharaStep.approval_step_id,
        transfer_proof_path: null, // Reset bukti transfer pencairan bendahara jika ada
      },
      {
        where: { financing_id: app.financing_id },
        transaction: t,
      }
    );
    console.log(`📝 Status FinancingApplication diupdate ke: PENDING (current_step_id: ${bendaharaStep.approval_step_id})`);

    await t.commit();

    console.log(`\n======================================================`);
    console.log(`🎉 ROLLBACK BERHASIL!`);
    console.log(`   Pengajuan sekarang berstatus PENDING di antrian Bendahara.`);
    console.log(`   Tagihan DP dan cicilan belum dibuat (Total Terbayar = Rp 0).`);
    console.log(`   Silakan buka akun Bendahara di admin untuk memverifikasi.`);
    console.log(`======================================================\n`);
  } catch (err) {
    await t.rollback();
    console.error(`\n❌ ROLLBACK GAGAL:`, err.message);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

rollbackToBendaharaPending();
