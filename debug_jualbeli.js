import db from './models/index.js';
import { syncJualBeliReport } from './services/jualBeliReportSyncService.js';

async function run() {
  try {
    const memberId = '5880c3cd-d403-40dd-997b-319629799cab';
    await syncJualBeliReport(db.sequelize, memberId);
    console.log("Done syncing jual beli report.");
  } catch(e) {
    console.error("ERROR:", e);
  }
}

run().catch(console.error).finally(() => process.exit());
