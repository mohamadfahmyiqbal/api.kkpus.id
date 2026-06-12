import db from './models/index.js';

async function research() {
  const tablesWithAutoIncrement = await db.sequelize.query(`
    SELECT TABLE_NAME, COLUMN_NAME 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE EXTRA LIKE '%auto_increment%' 
    AND TABLE_SCHEMA = 'koperasi'
  `);

  console.log("Tables with AUTO_INCREMENT:");
  console.log(JSON.stringify(tablesWithAutoIncrement[0], null, 2));

  const allForeignKeys = await db.sequelize.query(`
    SELECT TABLE_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
    WHERE REFERENCED_TABLE_NAME IS NOT NULL 
    AND TABLE_SCHEMA = 'koperasi'
  `);

  console.log("All Foreign Keys:");
  console.log(JSON.stringify(allForeignKeys[0], null, 2));

  process.exit(0);
}

research().catch(console.error);
