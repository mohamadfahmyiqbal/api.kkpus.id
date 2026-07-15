import db from './models/index.js';

(async () => {
  try {
    await db.sequelize.query('ALTER TABLE financing_applications ADD COLUMN operational_cost DECIMAL(18,2) DEFAULT 0;');
    console.log('Column added successfully');
  } catch (e) {
    if (e.message.includes('Duplicate column name')) {
        console.log('Column already exists');
    } else {
        console.error('Error:', e);
    }
  } finally {
    process.exit(0);
  }
})();
