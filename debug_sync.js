import db from './models/index.js';
import { syncFinancialSummary } from './services/financialSummarySyncService.js';

async function run() {
  try {
    console.log("Syncing member:", 'f98594e5-d43c-4acb-8052-b108c36c79cc');
    await syncFinancialSummary(db.sequelize, 'f98594e5-d43c-4acb-8052-b108c36c79cc');
    console.log("Sync completed");
    
    const summary = await db.MemberFinancialSummary.findByPk('f98594e5-d43c-4acb-8052-b108c36c79cc');
    console.log("Summary:", summary.toJSON());
  } catch (e) {
    console.error("DEBUG SCRIPT ERR:", e);
  } finally {
    process.exit();
  }
}

run();
