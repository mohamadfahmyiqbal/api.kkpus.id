import db from "./models/index.js";

async function fix() {
  try {
    const flow = await db.ApprovalFlow.findOne({ where: { flow_name: 'FLOW_TABUNGAN' } });
    if (!flow) {
      console.log("No FLOW_TABUNGAN found.");
      return;
    }
    
    const firstStep = await db.ApprovalStep.findOne({
      where: { approval_flow_id: flow.approval_flow_id },
      order: [['step_order', 'ASC']]
    });

    if (!firstStep) {
      console.log("No first step found.");
      return;
    }

    const [result] = await db.sequelize.query(
      `UPDATE member_saving_targets SET current_step_id = ${firstStep.approval_step_id}, approval_flow_id = ${flow.approval_flow_id} WHERE current_step_id IS NULL`
    );
    console.log("Fixed old records.");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

fix();
