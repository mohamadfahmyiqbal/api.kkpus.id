// scripts/test-sanitization.cjs - Test log sanitization functionality

require('dotenv').config();

const { sanitizeData, sanitizeRequest } = require('../utils/logSanitizer.js');

async function testSanitization() {
  console.log('=== Testing Log Sanitization ===\n');

  // Test 1: String sanitization
  console.log('1. Testing string sanitization:');
  const email = 'john.doe@example.com';
  const sanitizedEmail = sanitizeData(email);
  console.log(`   Input: ${email}`);
  console.log(`   Output: ${sanitizedEmail}\n`);

  const phone = '+1234567890';
  const sanitizedPhone = sanitizeData(phone);
  console.log(`   Input: ${phone}`);
  console.log(`   Output: ${sanitizedPhone}\n`);

  // Test 2: Object sanitization
  console.log('2. Testing object sanitization:');
  const userData = {
    email: 'mary.smith@example.com',
    password: 'secret123',
    password_hash: 'hashed_value',
    phone: '+1987654321',
    member_no: 'M123456',
    credit_card: '4111-XXXX-XXXX-1111',
    api_key: 'dummy_sanitization_test_key',
    normal_field: 'public info',
    nested_object: {
      sensitive_field: 'sensitive_value',
      normal_field: 'normal_value'
    }
  };

  const sanitizedUserData = sanitizeData(userData);
  console.log('   Original:', JSON.stringify(userData, null, 2));
  console.log('   Sanitized:', JSON.stringify(sanitizedUserData, null, 2));
  console.log();

  // Test 3: Array sanitization
  console.log('3. Testing array sanitization:');
  const products = [
    { product_name: 'Product 1', price: 100, credit_card: '4111-XXXX-XXXX-1111' },
    { product_name: 'Product 2', price: 200, password: 'secret' }
  ];

  const sanitizedProducts = sanitizeData(products);
  console.log('   Sanitized:', JSON.stringify(sanitizedProducts, null, 2));
  console.log();

  // Test 4: Request sanitization
  console.log('4. Testing request sanitization (simulated):');
  // Simulate a request object (simplified)
  const mockRequest = {
    method: 'POST',
    url: '/api/auth/login',
    ip: '192.168.1.1',
    headers: {
      'user-agent': 'Mozilla/5.0',
      'authorization': 'Bearer token123'
    },
    body: {
      emailHp: 'user@example.com',
      password: 'secretpassword',
      ip_address: '192.168.1.1',
      normal_field: 'public_data'
    },
    query: { param1: 'value1', secret: 'hidden' },
    params: { id: '123', api_key: 'sk_test_123456' }
  };

  const sanitizedReq = sanitizeRequest(mockRequest);
  console.log('   Request body (sanitized):', JSON.stringify(sanitizedReq.body, null, 2));
  console.log('   Request headers (sanitized):', JSON.stringify(sanitizedReq.headers, null, 2));
  console.log();

  console.log('✅ Log sanitization test completed successfully!');
}

if (require.main === module) {
  testSanitization().catch(console.error);
}

module.exports = { testSanitization };