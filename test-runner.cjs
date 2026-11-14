#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Loading test environment...');

/* Load .env.test if it exists */
const envTestPath = path.join(__dirname, '.env.test');
if (fs.existsSync(envTestPath)) {
  const envContent = fs.readFileSync(envTestPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=');
        process.env[key.trim()] = value.trim();
      }
    }
  }
}

/* Set test-specific environment variables for production (MySQL on VPS) */
if (!process.env.DB_DIALECT) {
  process.env.DB_DIALECT = 'mysql';
}
process.env.DB_NAME = 'koperasi';
process.env.DB_USER = 'admin';
process.env.DB_PASSWORD = 'qwerty123!!';
process.env.DB_HOST = 'kkpus.id';
process.env.DB_PORT = '3306';
process.env.NODE_ENV = 'test';

/* Import models to initialize database tables */
console.log('🔧 Initializing models...');
require('./models/index.js'); // This runs initModels and initCooperativeBanks

/* Ensure SQLite tables exist for test environment */
if (process.env.DB_DIALECT === 'sqlite') {
  try {
    const db = require('./models/index.js');
    await db.default.sequelize.sync({ alter: true });
    console.log('✅ SQLite tables synced for test environment');
  } catch (err) {
    console.error('⚠️ Failed to sync SQLite tables:', err.message);
  }
}

console.log('🔧 Test environment configured:');
console.log(`   DB_DIALECT: ${process.env.DB_DIALECT}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   DB_STORAGE: ${process.env.DB_STORAGE || './database/local-dev.sqlite'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET.substring(0, 10)}...`);

/* Run tests with vitest */
const vitestCommand = process.argv.length > 2 ? process.argv.slice(2).join(' ') : 'run';
const command = `npx vitest ${vitestCommand}`;

console.log(`\n🧪 Running tests: ${command}`);

try {
  execSync(command, {
    stdio: 'inherit',
    env: process.env,
  });
} catch (error) {
  console.error('❌ Tests failed:', error.message);
  process.exit(1);
}