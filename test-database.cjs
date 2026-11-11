// test-database.cjs - Simple test to verify database connection
const { Sequelize } = require('sequelize');

// Check if sqlite3 is available
let sqlite3Available = false;
try {
  require('sqlite3');
  sqlite3Available = true;
  console.log('✅ sqlite3 module is available');
} catch (error) {
  console.error('❌ sqlite3 module is not available:', error.message);
}

// Try using the built-in sqlite3 from Node.js
async function testSQLiteConnection() {
  try {
    // Try to use the built-in sqlite3 module that comes with Node.js
    const sqlite3 = require('sqlite3');
    
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './database/local-dev.sqlite',
      logging: false,
    });

    await sequelize.authenticate();
    console.log('✅ SQLite connection successful');
    await sequelize.close();
    return true;
  } catch (error) {
    console.error('❌ SQLite connection failed:', error.message);
    return false;
  }
}

async function testMySQLConnection() {
  try {
    const mysql2 = require('mysql2');
    
    const sequelize = new Sequelize({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'koperasi',
      username: 'root',
      password: '',
      logging: false,
      dialectOptions: {
        connectTimeout: 10000,
      },
    });

    await sequelize.authenticate();
    console.log('✅ MySQL connection successful');
    await sequelize.close();
    return true;
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('\n=== Testing Database Connections ===\n');
  
  // Try MySQL first
  const mysqlSuccess = await testMySQLConnection();
  if (mysqlSuccess) {
    console.log('\n✅ MySQL connection is working. Using MySQL database.');
    return;
  }
  
  // Try SQLite
  const sqliteSuccess = await testSQLiteConnection();
  if (sqliteSuccess) {
    console.log('\n✅ SQLite connection is working. Using SQLite database.');
    return;
  }
  
  console.error('\n❌ No database connection available.');
  console.log('\nTo fix this, you can try:');
  console.log('1. Install MySQL: sudo apt-get install mysql-server');
  console.log('2. Or, install sqlite3: npm install sqlite3');
  console.log('3. Check if there are permission issues with the database directory');
  process.exit(1);
}

main().catch(console.error);