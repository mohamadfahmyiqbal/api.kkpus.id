import db from "./models/index.js";

async function run() {
  const withdrawals = await db.SavingsWithdrawal.findAll({
    raw: true
  });
  console.log("Withdrawals in DB:");
  console.table(withdrawals.map(w => ({
    id: w.withdrawal_id,
    amount: w.amount,
    account_id: w.savings_account_id,
    target_id: w.member_saving_target_id,
    status: w.status
  })));
  
  process.exit(0);
}

run();
