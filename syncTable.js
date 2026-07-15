import db from "./models/index.js";

async function syncTable() {
  try {
    await db.PaymentFeeConfig.sync({ alter: true });
    console.log("payment_fee_configs table created or updated successfully.");
    
    // Seed initial data if empty
    const count = await db.PaymentFeeConfig.count();
    if (count === 0) {
      await db.PaymentFeeConfig.bulkCreate([
        { payment_type: 'bank_transfer', payment_name: 'Transfer Bank (Virtual Account)', fee_type: 'FLAT', flat_fee: 4440, percentage_fee: 0 },
        { payment_type: 'ewallet', payment_name: 'E-Wallet', fee_type: 'PERCENTAGE', flat_fee: 0, percentage_fee: 2 },
        { payment_type: 'qris', payment_name: 'QRIS', fee_type: 'PERCENTAGE', flat_fee: 0, percentage_fee: 0.7 },
        { payment_type: 'cstore', payment_name: 'Gerai Retail', fee_type: 'FLAT', flat_fee: 5550, percentage_fee: 0 },
        { payment_type: 'credit_card', payment_name: 'Kartu Kredit / Debit', fee_type: 'FLAT_AND_PERCENTAGE', flat_fee: 2000, percentage_fee: 2.9 },
      ]);
      console.log("Seeded initial data.");
    }
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    process.exit();
  }
}

syncTable();
