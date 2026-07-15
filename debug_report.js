import db from './models/index.js';

async function run() {
  const report = await db.SavingsReportList.findOne({
    where: { member_id: '5880c3cd-d403-40dd-997b-319629799cab' },
  });
  console.log(JSON.stringify(report, null, 2));
}

run().catch(console.error).finally(() => process.exit());
