import db from "./models/index.js";

async function run() {
  const wd = await db.SavingsWithdrawal.findAll({
    where: { status: ['DISBURSED', 'PAID', 'COMPLETED', 'READY_TO_PAY', 'PENDING_EXTERNAL'] },
    include: [{ model: db.MemberSavingTarget, as: 'savingTarget' }]
  });

  let fixedCount = 0;
  for (const withdrawal of wd) {
    if (withdrawal.savingTarget && withdrawal.savingTarget.status !== 'COMPLETED') {
      const target = withdrawal.savingTarget;
      const newBalance = parseFloat(target.current_balance) - parseFloat(withdrawal.amount);
      if (newBalance <= 0) {
        await db.MemberSavingTarget.update(
          { current_balance: newBalance < 0 ? 0 : newBalance, status: 'COMPLETED' },
          { where: { member_saving_target_id: target.member_saving_target_id } }
        );
        fixedCount++;
        console.log(`Fixed Tabungan ${target.member_saving_target_id}, balance set to 0, status COMPLETED.`);
      }
    }
  }
  
  console.log(`Fixed ${fixedCount} tabungan targets.`);
  process.exit(0);
}

run();
