import db from './models/index.js';

async function run() {
  const accounts = await db.MemberSavingsAccount.findAll({
    where: { member_id: 'f98594e5-d43c-4acb-8052-b108c36c79cc' },
    include: [{ model: db.SavingsProduct, as: "savingsProduct" }]
  });
  console.log(JSON.stringify(accounts, null, 2));
}

run().catch(console.error).finally(() => process.exit());
