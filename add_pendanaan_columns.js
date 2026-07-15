import db from './models/index.js';

(async () => {
  try {
    const queries = [
      'ALTER TABLE financing_applications ADD COLUMN business_name VARCHAR(255);',
      'ALTER TABLE financing_applications ADD COLUMN business_sector VARCHAR(100);',
      'ALTER TABLE financing_applications ADD COLUMN business_address TEXT;',
      'ALTER TABLE financing_applications ADD COLUMN estimated_yearly_turnover DECIMAL(18,2) DEFAULT 0;',
      'ALTER TABLE financing_applications ADD COLUMN estimated_monthly_turnover DECIMAL(18,2) DEFAULT 0;',
      'ALTER TABLE financing_applications ADD COLUMN investor_profit_share DECIMAL(5,2) DEFAULT 0;',
      'ALTER TABLE financing_applications ADD COLUMN contract_proof VARCHAR(255);',
      'ALTER TABLE financing_applications ADD COLUMN additional_documents VARCHAR(255);',
    ];

    for (const q of queries) {
      try {
        await db.sequelize.query(q);
        console.log(`Executed: ${q}`);
      } catch (err) {
        if (err.message && err.message.includes('Duplicate column name')) {
          console.log(`Column already exists for query: ${q}`);
        } else if (err.original && err.original.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists for query: ${q}`);
        } else {
          console.error(`Error executing ${q}:`, err);
        }
      }
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    process.exit(0);
  }
})();
