import { v4 as uuidv4 } from 'uuid';
import db from './models/index.js';

async function seed() {
  try {
    const member = await db.sequelize.query('SELECT * FROM members LIMIT 1', { type: db.Sequelize.QueryTypes.SELECT });
    const memberId = member[0].member_id;
    console.log('Using Member ID:', memberId);

    // 1. Kas Awal (Modal) in 2024
    await db.sequelize.query(`
      INSERT INTO pinjaman_modal_transactions 
      (tanggal, no_transaksi, pic, keperluan, jenis, jumlah, created_at, updated_at) 
      VALUES 
      ('2024-01-01', 'MODAL-2024-${Date.now()}', 'Admin', 'Modal Awal 2024', 'DEBET', 10000000, '2024-01-01 10:00:00', '2024-01-01 10:00:00')
    `);

    // 2. Loan 1 (COMPLETED in 2024) - 2,000,000
    const loan1Id = uuidv4();
    await db.sequelize.query(`
      INSERT INTO financing_applications 
      (financing_id, member_id, purpose, required_amount, down_payment, status, created_at, updated_at)
      VALUES
      ('${loan1Id}', '${memberId}', 'Pinjaman Konsumtif (Test 1)', 2000000, 0, 'COMPLETED', '2024-02-01 10:00:00', '2024-12-01 10:00:00')
    `);

    // Bill items for Loan 1 (Paid)
    for (let i = 1; i <= 10; i++) {
      const monthNum = i + 1;
      const monthStr = monthNum.toString().padStart(2, '0');
      await db.sequelize.query(`
        INSERT INTO bill_items 
        (bill_item_id, category_code, description, amount, due_date, status, financing_application_id, created_at, updated_at)
        VALUES
        ('${uuidv4()}', 'TRANSACTION_INSTALLMENT', 'Cicilan ${i}', 200000, '2024-${monthStr}-01 10:00:00', 'PAID', '${loan1Id}', '2024-02-01 10:00:00', '2024-${monthStr}-01 10:00:00')
      `);
    }

    // 3. Loan 2 (ACTIVE from 2024) - 3,000,000, paid 1,000,000
    const loan2Id = uuidv4();
    await db.sequelize.query(`
      INSERT INTO financing_applications 
      (financing_id, member_id, purpose, required_amount, down_payment, status, created_at, updated_at)
      VALUES
      ('${loan2Id}', '${memberId}', 'Pinjaman Modal Kerja (Test 2)', 3000000, 0, 'ACTIVE', '2024-06-01 10:00:00', '2024-06-01 10:00:00')
    `);

    // Bill items for Loan 2 (Paid 5 months in 2024)
    for (let i = 1; i <= 10; i++) {
      const isPaid = i <= 5;
      const status = isPaid ? 'PAID' : 'UNPAID';
      const monthNum = i + 6;
      const year = monthNum > 12 ? 2025 : 2024;
      const finalMonth = monthNum > 12 ? monthNum - 12 : monthNum;
      const monthStr = finalMonth.toString().padStart(2, '0');
      const upDate = isPaid ? `'${year}-${monthStr}-01 10:00:00'` : `'2024-06-01 10:00:00'`;
      await db.sequelize.query(`
        INSERT INTO bill_items 
        (bill_item_id, category_code, description, amount, due_date, status, financing_application_id, created_at, updated_at)
        VALUES
        ('${uuidv4()}', 'TRANSACTION_INSTALLMENT', 'Cicilan ${i}', 300000, '${year}-${monthStr}-01 10:00:00', '${status}', '${loan2Id}', '2024-06-01 10:00:00', ${upDate})
      `);
    }

    console.log('Seeding historical data completed!');
  } catch (err) {
    console.error('Error seeding:', err);
  }
}

seed();
