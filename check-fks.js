import db from './models/index.js';
async function run() {
  const q = await db.sequelize.query("SELECT TABLE_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE REFERENCED_TABLE_NAME = 'financing_applications'");
  console.log(q[0]);
  process.exit(0);
}
run();
