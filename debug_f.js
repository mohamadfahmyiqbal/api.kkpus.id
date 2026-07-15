import db from './models/index.js';

async function run() {
  try {
    const summary = await db.MemberFinancialSummary.findAll();
    console.log("Summary:", summary.map(s => s.toJSON()));
    
    const accounts = await db.Account.findAll();
    console.log("Accounts:", accounts.map(a => a.toJSON()));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

run();
