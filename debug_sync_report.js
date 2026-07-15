import db from './models/index.js';
import { syncSavingsReportList } from './services/savingsReportSyncService.js';

async function run() {
  try {
    const memberId = '5880c3cd-d403-40dd-997b-319629799cab';
    await syncSavingsReportList(db.sequelize, memberId);
    
    const report = await db.SavingsReportList.findOne({
      where: { member_id: memberId }
    });
    console.log("Report after sync:", JSON.stringify(report, null, 2));
  } catch(e) {
    console.error("ERROR:", e);
  }
}

run().catch(console.error).finally(() => process.exit());
