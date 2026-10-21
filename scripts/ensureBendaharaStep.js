// PATH: scripts/ensureBendaharaStep.js
import "dotenv/config";
import db from "../models/index.js";

/**
 * Script untuk memastikan ApprovalFlow "member_registrations" memiliki Step 3: Bendahara
 */
async function ensureBendaharaStep() {
  const t = await db.sequelize.transaction();
  try {
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

    if (!flow) {
      throw new Error("ApprovalFlow 'member_registrations' tidak ditemukan.");
    }

    console.log(`Flow ditemukan: ${flow.flow_name} (${flow.approval_flow_id})`);
    console.log(`Jumlah langkah saat ini: ${flow.steps.length}`);

    const hasBendaharaStep = flow.steps.some(
      (s) => s.step_order === 3 || s.role_id === "4" || (s.verifierRole?.role_name || "").toLowerCase().includes("bendahara")
    );

    if (!hasBendaharaStep) {
      console.log("Menambahkan Step 3: Verifikasi Setoran Bendahara...");
      const bendaharaRole = await db.UserRole.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { role_name: "Bendahara" },
            { role_id: "4" },
          ],
        },
        transaction: t,
      });

      const roleId = bendaharaRole ? bendaharaRole.role_id : "4";

      const newStep = await db.ApprovalStep.create(
        {
          approval_flow_id: flow.approval_flow_id,
          step_order: 3,
          role_id: roleId,
          step_name: "Verifikasi Setoran Bendahara",
        },
        { transaction: t }
      );

      console.log(`✅ Step 3 Bendahara berhasil dibuat: ID = ${newStep.approval_step_id}`);
    } else {
      console.log("ℹ️ Step 3 Bendahara sudah ada di flow database.");
    }

    await t.commit();
    console.log("Selesai!");
    process.exit(0);
  } catch (err) {
    await t.rollback();
    console.error("Gagal memastikan Step Bendahara:", err.message);
    process.exit(1);
  }
}

ensureBendaharaStep();
