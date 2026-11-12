// test-db-vps.cjs - Test database connection to VPS
require('dotenv').config();
const { Sequelize } = require('sequelize');

async function testDBConnection() {
  try {
    const sequelize = new Sequelize(
      process.env.DB_NAME || 'koperasi',
      process.env.DB_USER || 'admin',
      process.env.DB_PASSWORD || 'qwerty123!!',
      {
        host: process.env.DB_HOST || '202.52.147.193',
        port: parseInt(process.env.DB_PORT || '3306'),
        dialect: process.env.DB_DIALECT || 'mysql',
        logging: false,
        dialectOptions: {
          connectTimeout: 10000,
        },
        retry: {
          max: 3,
          timeout: 15000,
        },
      }
    );

    console.log(`Testing connection to ${process.env.DB_HOST}...`);
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    await sequelize.close();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

if (require.main === module) {
  testDBConnection();
}

module.exports = { testDBConnection };