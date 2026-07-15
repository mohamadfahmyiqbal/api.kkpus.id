import db from './models/index.js';

async function run() {
  const accounts = await db.MemberSavingsAccount.findAll({
    include: [{ model: db.SavingsProduct, as: "savingsProduct", attributes: ["name"] }]
  });
  console.log("MemberSavingsAccounts:");
  accounts.forEach(a => {
    console.log(`Member: ${a.member_id}, Product: ${a.savingsProduct?.name}, Balance: ${a.current_balance}`);
  });
}

run().catch(console.error).finally(() => process.exit());
