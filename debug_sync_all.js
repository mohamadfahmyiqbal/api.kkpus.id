import db from './models/index.js';
import { syncSavingsReportList } from './services/savingsReportSyncService.js';

async function run() {
  try {
    await syncSavingsReportList(db.sequelize);
    console.log("Done syncing all members.");
  } catch(e) {
    console.error("ERROR:", e);
  }
}

run().catch(console.error).finally(() => process.exit());
