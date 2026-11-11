// scripts/fix-database.js
const fs = require('fs');
const path = require('path');

console.log('=== Fixing Database Connection ===\n');

// Backup current .env
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const backupPath = path.join(process.cwd(), '.env.backup');
  fs.copyFileSync(envPath, backupPath);
  console.log('✅ Backed up .env to .env.backup');
}

// Create a simple MySQL test script to check if we can connect
const testConnection = `const { Sequelize } = require('sequelize');

// Try local MySQL first
const localConfig = {
  username: 'root',
  password: '',
  database: 'koperasi',
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',
  logging: false,
  dialectOptions: { connectTimeout: 10000 }
};

async function testLocalConnection() {
  try {
    const sequelize = new Sequelize(localConfig);
    await sequelize.authenticate();
    console.log('✅ Local MySQL connection successful');
    await sequelize.close();
    return true;
  } catch (error) {
    console.log('❌ Local MySQL connection failed:', error.message);
    return false;
  }
}

// If local fails, try dockerized MySQL
async function testDockerConnection() {
  try {
    const dockerConfig = {
      username: 'root',
      password: 'mysql123',
      database: 'koperasi',
      host: 'localhost',
      port: 3307,
      dialect: 'mysql',
      logging: false,
      dialectOptions: { connectTimeout: 10000 }
    };
    
    const sequelize = new Sequelize(dockerConfig);
    await sequelize.authenticate();
    console.log('✅ Docker MySQL (port 3307) connection successful');
    await sequelize.close();
    return true;
  } catch (error) {
    console.log('❌ Docker MySQL connection failed:', error.message);
    return false;
  }
}

async function main() {
  const hasLocal = await testLocalConnection();
  const hasDocker = await testDockerConnection();
  
  // Update .env based on what works
  if (hasLocal) {
    const localEnv = `
# Database configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=koperasi

# Sequelize connection options
DB_POOL_MAX=20
DB_POOL_MIN=2

# Security
NODE_TLS_REJECT_UNAUTHORIZED=0

# Server configuration (override from package.json defaults)
HTTPS_PORT=3445
HTTP_PORT=3000

# SSL configuration
SSL_KEY_PATH=config/certs/production/kkpusid.key
SSL_CERT_PATH=config/certs/production/kkpus_id.crt
SSL_CA_PATH=config/certs/production/ca.crt

# Set NODE_ENV to development to avoid production-only errors
NODE_ENV=development
`;
    fs.writeFileSync(envPath, localEnv);
    console.log('✅ Updated .env for local MySQL connection');
  } else if (hasDocker) {
    const dockerEnv = `
# Database configuration
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=mysql123
DB_NAME=koperasi

# Sequelize connection options
DB_POOL_MAX=20
DB_POOL_MIN=2

# Security
NODE_TLS_REJECT_UNAUTHORIZED=0

# Server configuration (override from package.json defaults)
HTTPS_PORT=3445
HTTP_PORT=3000

# SSL configuration
SSL_KEY_PATH=config/certs/production/kkpusid.key
SSL_CERT_PATH=config/certs/production/kkpus_id.crt
SSL_CA_PATH=config/certs/production/ca.crt

# Set NODE_ENV to development to avoid production-only errors
NODE_ENV=development
`;
    fs.writeFileSync(envPath, dockerEnv);
    console.log('✅ Updated .env for Docker MySQL connection');
  } else {
    console.log('❌ No available MySQL connection');
    // For now, use SQLite as fallback for testing
    const sqliteEnv = `
# Using SQLite for testing/development
DB_HOST=localhost
DB_PORT=3306
DB_USER=sqlite_user
DB_PASSWORD=sqlite_password
DB_NAME=koperasi
DB_DIALECT=sqlite
DB_STORAGE=:memory:

# Sequelize connection options
DB_POOL_MAX=5
DB_POOL_MIN=1

# Security
NODE_TLS_REJECT_UNAUTHORIZED=0

# Server configuration (override from package.json defaults)
HTTPS_PORT=3445
HTTP_PORT=3000

# Set NODE_ENV to development
NODE_ENV=development
`;
    fs.writeFileSync(envPath, sqliteEnv);
    console.log('✅ Updated .env for SQLite testing');
  }
  
  console.log('\n=== Next Steps ===');
  console.log('1. Install MySQL if needed: npm install mysql2 mysql')
  console.log('2. Start MySQL service');
  console.log('3. Run tests to verify connection');
  console.log('4. Commit database configuration changes');
}

main().catch(console.error);

module.exports = { main };