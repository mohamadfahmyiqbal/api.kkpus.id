#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function main() {
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
  process.env.DB_DIALECT = 'mysql';
  process.env.DB_NAME = 'koperasi';
  process.env.DB_USER = 'admin';
  process.env.DB_PASSWORD = 'qwerty123!!';
  process.env.DB_HOST = '202.52.147.193';
  process.env.DB_PORT = '3306';
  process.env.NODE_ENV = 'test';
  
  /* Import models to initialize database tables */
  console.log('🔧 Initializing models...');
  require('./models/index.js'); // This runs initModels and initCooperativeBanks
  
  /* Ensure SQLite tables exist for test environment (will be skipped since DB_DIALECT=mysql) */
  if (process.env.DB_DIALECT === 'sqlite') {
    try {
      const db = require('./models/index.js');
      await db.default.sequelize.sync({ alter: true });
      console.log('✅ SQLite tables synced for test environment');
    } catch (err) {
      console.error('⚠️ Failed to sync SQLite tables:', err.message);
    }
  }

  /* Sinkronisasi semua tabel MySQL untuk test environment */
  // First, manually create the missing tables that cannot be synced due to foreign key constraints
  try {
    const db = require('./models/index.js');
    
    // Create tables manually if they don't exist
    if (db.AccountLockout) {
      await db.AccountLockout.sync({ alter: false });
    }
    if (db.LoginAttempt) {
      await db.LoginAttempt.sync({ alter: false });
    }
    if (db.ForgotPasswordSession) {
      await db.ForgotPasswordSession.sync({ alter: false });
    }
    if (db.PasswordResetToken) {
      await db.PasswordResetToken.sync({ alter: false });
    }
    
    // Then try full sync with alter false to avoid FK issues
    await db.default.sequelize.sync({ alter: false });
    console.log('✅ MySQL tables created for test environment');
    
    // Pre-populate test user for login test
    const Member = db.Member;
    const bcrypt = require('bcrypt');
    const crypto = require('crypto');
    
    // Check if member with member_id for login test exists
    const loginMemberId = '83747cb3-2fb0-477c-81b8-9ca32c0c0a2e';
    const memberExists = await Member.findByPk(loginMemberId);
    if (!memberExists) {
      // Create test user for login test
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash('Password123!', salt);
      
      await Member.destroy({ where: { email: 'test@example.com' } });
      console.log('🔧 Created test user for login test with email:', 'test@example.com');
      const testUser = await Member.create({
        member_id: loginMemberId,
        member_no: 'M001',
        full_name: 'Test User',
        email: 'test@example.com',
        phone_number: '081234567890',
        password_hash: password_hash,
        member_type: 'REGULER',
        gender: 'L',
        date_of_brith: new Date('1990-01-01'),
        join_date: new Date('2024-01-01'),
        nik_ktp: '1234567890123456',
        address: 'Test Address',
        status_id: null,
        is_registration_done: 1,
        province_id: '11',
        city_id: '1107',
        district_id: '1107-01',
        subdistrict_id: '1107-01-001',
        rt: '001',
        rw: '001',
      });
      console.log('✅ Test user created for login test');
    }
    
    // Also create test user for logout test and admin actions (member_id 1)
    const logoutMemberId = '1';
    await Member.destroy({ where: { member_id: logoutMemberId } });
    const saltAdmin = await bcrypt.genSalt(10);
    const password_hash_admin = await bcrypt.hash('adminPassword123', saltAdmin);
    
    await Member.create({
      member_id: logoutMemberId,
      member_no: 'M002',
      full_name: 'Test Admin',
      email: 'admin@example.com',
      phone_number: '081234567891',
      password_hash: password_hash_admin,
      member_type: 'REGULER',
      gender: 'L',
      date_of_brith: new Date('1990-01-01'),
      join_date: new Date('2024-01-01'),
      nik_ktp: '1234567890123457',
      address: 'Test Address 2',
      status_id: null,
      is_registration_done: 1,
      province_id: '11',
      city_id: '1107',
      district_id: '1107-01',
      subdistrict_id: '1107-01-001',
      rt: '002',
      rw: '002',
    });
    console.log('✅ Admin user created/reset for tests');
    
  } catch (err) {
    console.error('⚠️ Failed to sync MySQL tables:', err.message);
  }
  
  console.log('🔧 Test environment configured:');
  console.log(`   DB_DIALECT: ${process.env.DB_DIALECT}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   DB_STORAGE: ${process.env.DB_STORAGE || './database/local-dev.sqlite'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET.substring(0, 10)}...`);
  
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
}

main().catch((err) => {
  console.error('❌ Test runner error:', err.message);
  process.exit(1);
});