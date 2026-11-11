// test-database.js - Simple test to verify database connection
const { Sequelize } = require('sequelize');

// Check if sqlite3 is available
try {
  require('sqlite3');
  console.log('✅ sqlite3 module is available');
} catch (error) {
  console.error('❌ sqlite3 module is not available:', error.message);
  process.exit(1);
}

async function testSQLiteConnection() {
  try {
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: './database/local-dev.sqlite',
      logging: console.log,
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

async function main() {
  const success = await testSQLiteConnection();
  if (!success) {
    console.error('\n❌ Database connection failed. Please check if sqlite3 is properly installed.');
    console.log('\nTo fix this, you can try:');
    console.log('1. Install sqlite3: npm install sqlite3');
    console.log('2. Or, use a different database (MySQL/PostgreSQL)');
    console.log('3. Check if there are permission issues with the database directory');
    process.exit(1);
  }
}

main().catch(console.error);