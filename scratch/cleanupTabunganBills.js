import dotenv from 'dotenv';
dotenv.config();
import db from '../models/index.js';

async function cleanup() {
  try {
    console.log("Starting raw SQL cleanup of legacy Tabungan UNPAID bills...");
    const result = await db.sequelize.query("DELETE FROM bill_items WHERE category_code LIKE 'TAB_DEP_%' AND status = 'UNPAID'");
    console.log(`Successfully executed raw SQL delete.`);
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
}

cleanup();
