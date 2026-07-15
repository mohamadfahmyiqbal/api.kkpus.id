import db from './models/index.js';
import { syncFinancialSummary } from './services/financialSummarySyncService.js';

async function run() {
  try {
    const memberId = '5880c3cd-d403-40dd-997b-319629799cab';
    await syncFinancialSummary(db.sequelize, memberId);
    console.log("Done syncing financial summary.");
  } catch(e) {
    console.error("ERROR:", e);
  }
}

run().catch(console.error).finally(() => process.exit());
