import { v4 as uuidv4 } from "uuid";
import db from "./models/index.js";

async function seedTabunganWithdrawalsFlow() {
  const t = await db.sequelize.transaction();
  try {
    // 1. Dapatkan role yang dibutuhkan
    const pengawasRole = await db.UserRole.findOne({ where: { role_name: 'Pengawas' } });
    const ketuaRole = await db.UserRole.findOne({ where: { role_name: 'Ketua' } });
    const bendaharaRole = await db.UserRole.findOne({ where: { role_name: 'Bendahara' } });

    if (!pengawasRole || !ketuaRole || !bendaharaRole) {
      throw new Error("One or more required roles not found");
    }

    // 2. Check apakah approval flow sudah ada
    const existingFlow = await db.ApprovalFlow.findOne({
      where: { entity_ref: 'tabungan_withdrawals' }
    });

    if (existingFlow) {
      console.log("Approval Flow for tabungan_withdrawals already exists. Exiting...");
      await t.rollback();
      process.exit(0);
    }

    // 3. Buat Approval Flow
    const flow = await db.ApprovalFlow.create({
      approval_flow_id: uuidv4(),
      entity_ref: 'tabungan_withdrawals',
      entity_id: uuidv4(), // Virtual reference
      flow_name: 'Penarikan Tabungan'
    }, { transaction: t });

    // 4. Buat Approval Steps
    await db.ApprovalStep.bulkCreate([
      {
        approval_step_id: uuidv4(),
        approval_flow_id: flow.approval_flow_id,
        role_id: pengawasRole.role_id,
        step_order: 1,
        is_required: true,
        step_name: 'Verifikasi'
      },
      {
        approval_step_id: uuidv4(),
        approval_flow_id: flow.approval_flow_id,
        role_id: ketuaRole.role_id,
        step_order: 2,
        is_required: true,
        step_name: 'Persetujuan'
      },
      {
        approval_step_id: uuidv4(),
        approval_flow_id: flow.approval_flow_id,
        role_id: bendaharaRole.role_id,
        step_order: 3,
        is_required: true,
        step_name: 'Pencairan'
      }
    ], { transaction: t });

    await t.commit();
    console.log("Successfully seeded tabungan_withdrawals Approval Flow.");
    process.exit(0);
  } catch (error) {
    await t.rollback();
    console.error("Failed to seed tabungan_withdrawals Approval Flow:", error);
    process.exit(1);
  }
}

seedTabunganWithdrawalsFlow();
