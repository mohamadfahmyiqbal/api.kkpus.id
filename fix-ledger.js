import db from "./models/index.js";

async function fixLedger() {
  const { Transaction, BillItem, BillType, SavingsProduct, MemberSavingsAccount } = db;

  const txs = await Transaction.findAll({
    where: { status: 'PAID' }
  });

  let fixedCount = 0;
  for (const tx of txs) {
    if (!tx.bill_id) continue;
    
    const items = await BillItem.findAll({
      where: { bill_id: tx.bill_id },
      include: [{ model: BillType, as: "type" }]
    });

    for (const item of items) {
      const billType = item.type;
      if (!billType) continue;

      const savingsProduct = await SavingsProduct.findOne({
        where: { product_code: billType.type_code }
      });

      if (savingsProduct) {
        const [savAcc, created] = await MemberSavingsAccount.findOrCreate({
          where: { member_id: tx.member_id, savings_product_id: savingsProduct.savings_product_id },
          defaults: {
            account_no: `SAV-${billType.type_code}-${tx.member_id.toString().substring(0,8)}`,
            account_type: savingsProduct.name,
            open_date: new Date(),
            current_balance: 0
          }
        });

        // We only fix if it was just created (meaning it was missed before)
        // Or if it's 0 (which might be because it was missed).
        if (created || parseFloat(savAcc.current_balance) === 0) {
          console.log(`Fixing balance for member ${tx.member_id}, product ${billType.type_code}, amount ${item.amount}`);
          await savAcc.increment('current_balance', { by: parseFloat(item.amount) });
          fixedCount++;
        }
      }
    }
  }
  console.log(`Fix complete. Fixed ${fixedCount} accounts.`);
  process.exit(0);
}
fixLedger();
