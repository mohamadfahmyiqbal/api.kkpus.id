import db from './models/index.js';

async function run() {
  const member = await db.Member.findByPk('5880c3cd-d403-40dd-997b-319629799cab');
  console.log("Member:", JSON.stringify(member, null, 2));
}

run().catch(console.error).finally(() => process.exit());
