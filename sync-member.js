import db from "./models/index.js";
import { syncFinancialSummary } from "./services/financialSummarySyncService.js";
import { syncJualBeliReport } from "./services/jualBeliReportSyncService.js";

async function run() {
  const memberId = "6c16df4e-6d44-45c4-b02b-05f022fdf1df";
  console.log(`Syncing member: ${memberId}`);
  await syncFinancialSummary(db.sequelize, memberId);
  await syncJualBeliReport(db.sequelize, memberId);
  console.log("Done");
  process.exit(0);
}

run();
