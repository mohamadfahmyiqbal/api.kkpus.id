import db from './models/index.js';

async function run() {
  await db.sequelize.query(`DELETE FROM entity_step_approvals WHERE entity_id = '5' AND entity_ref = 'financing_applications' AND approved_at < '2026-06-01'`);
  await db.sequelize.query(`DELETE FROM approvals WHERE entity_id = '5' AND entity_ref = 'financing_applications' AND decision_datetime < '2026-06-01'`);
  console.log('Orphaned records deleted');
  process.exit(0);
}

run().catch(console.error);
