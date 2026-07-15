import db from './models/index.js';

async function dropConstraint() {
  try {
    console.log("Attempting to drop foreign key constraint: savings_withdrawals_ibfk_1");
    
    // First, check if it exists (MySQL)
    const [results] = await db.sequelize.query(`
      SELECT CONSTRAINT_NAME 
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
      WHERE TABLE_NAME = 'savings_withdrawals' 
      AND CONSTRAINT_NAME = 'savings_withdrawals_ibfk_1'
      AND TABLE_SCHEMA = DATABASE()
    `);

    if (results.length > 0) {
      await db.sequelize.query('ALTER TABLE savings_withdrawals DROP FOREIGN KEY savings_withdrawals_ibfk_1');
      console.log("Successfully dropped foreign key constraint: savings_withdrawals_ibfk_1");
    } else {
      console.log("Constraint savings_withdrawals_ibfk_1 not found or already dropped.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error dropping constraint:", error.message);
    process.exit(1);
  }
}

dropConstraint();
