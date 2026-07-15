import db from './models/index.js';
await db.sequelize.authenticate();

const pelunasanApp = await db.FinancingApplication.findOne({
  where: { financing_id: { [db.Sequelize.Op.like]: '0d22ad51%' } }
});

const billItems = await db.BillItem.findAll({
  where: { financing_application_id: pelunasanApp.financing_id }
});

for (const b of billItems) {
  if (b.bill_id) {
    const tx = await db.Transaction.findOne({ where: { bill_id: b.bill_id } });
    if (tx) {
      console.log(`TX FOUND for BillItem ${b.bill_item_id}:`);
      console.log(`  tx_category: ${tx.tx_category}`);
      console.log(`  status: ${tx.status}`);
      console.log(`  is_ledger_recorded: ${tx.is_ledger_recorded}`);
    } else {
      console.log(`NO TX for BillItem ${b.bill_item_id}`);
    }
  } else {
    console.log(`BillItem ${b.bill_item_id} has NO bill_id`);
  }
}

process.exit(0);
