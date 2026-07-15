import db from './models/index.js';

async function run() {
  const memberId = '5880c3cd-d403-40dd-997b-319629799cab';
  const accounts = await db.MemberSavingsAccount.findAll({
    where: { member_id: memberId },
  });
  const transactions = await db.Transaction.findAll({
    where: { member_id: memberId },
  });
  console.log("MemberSavingsAccounts:", JSON.stringify(accounts, null, 2));
  console.log("Transactions:", JSON.stringify(transactions, null, 2));
}

run().catch(console.error).finally(() => process.exit());
