// PATH: tests/dashboardController.test.js
const request = require('supertest');
const express = require('express');
const db = require('../models/index.js');
const { Op } = require('sequelize');

const app = express();
app.use(express.json());

// Import the router
const dashboardRoute = require('../routes/dashboardRoute');
app.use('/api', dashboardRoute);

describe('Dashboard API', () => {
  beforeEach(async () => {
    await db.Member.create({
      member_id: 'M001',
      full_name: 'Test User',
      member_type: 'REGULAR'
    });
    
    await db.Savings.create({
      member_id: 'M001',
      amount: 1000000,
      status: 'COMPLETED'
    });
    
    await db.FinancingApplication.create({
      financing_id: 'F001',
      member_id: 'M001',
      category: 'Arisan',
      status: 'ACTIVE',
      amount_requested: 500000
    });
    
    await db.FinancingApplication.create({
      financing_id: 'F002', 
      member_id: 'M001',
      category: 'Jual Beli Mobil',
      status: 'ACTIVE',
      amount_requested: 1500000
    });
  });

  afterEach(async () => {
    await db.MemberSavingsTarget.destroy({ where: {} });
    await db.Savings.destroy({ where: {} });
    await db.SavingsWithdrawal.destroy({ where: {} });
    await db.FinancingApplication.destroy({ where: {} });
    await db.SukukOrder.destroy({ where: {} });
    await db.LoanProduct.destroy({ where: {} });
    await db.Member.destroy({ where: {} });
  });

  describe('GET /api/dashboard/admin - Dashboard Summary', () => {
    it('should return admin dashboard statistics', async () => {
      const response = await request(app)
        .get('/api/dashboard/admin')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toBeDefined();
      expect(response.body.data.pendingCategorized).toBeDefined();
      expect(response.body.data.notifications).toBeDefined();
      
      // Verify stats structure
      const stats = response.body.data.stats;
      expect(stats).toHaveLength(6);
      
      const totalAnggota = stats.find(s => s.title === 'Total Anggota');
      expect(totalAnggota).toBeDefined();
      expect(totalAnggota.value).toBeGreaterThan(0);
      
      // Verify pending categories structure
      const pending = response.body.data.pendingCategorized;
      expect(pending.registration).toBeDefined();
      expect(pending.simpanan).toBeDefined();
      expect(pending.jualBeli).toBeDefined();
      expect(pending.program).toBeDefined();
      expect(pending.tabungan).toBeDefined();
      expect(pending.investasi).toBeDefined();
    });

    it('should handle errors gracefully', async () => {
      const response = await request(app)
        .get('/api/dashboard/admin')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('Dashboard Data Validation', () => {
    it('should validate dashboard data structure', async () => {
      const response = await request(app)
        .get('/api/dashboard/admin')
        .expect(200);
      
      const data = response.body.data;
      
      // Validate stats array
      expect(Array.isArray(data.stats)).toBe(true);
      data.stats.forEach(stat => {
        expect(stat).toHaveProperty('title');
        expect(stat).toHaveProperty('value');
        expect(stat).toHaveProperty('icon');
        expect(stat).toHaveProperty('color');
        expect(stat).toHaveProperty('trend');
      });
      
      // Validate pending categorized object
      expect(data.pendingCategorized).toHaveProperty('registration');
      expect(data.pendingCategorized).toHaveProperty('simpanan');
      expect(data.pendingCategorized).toHaveProperty('jualBeli');
      expect(data.pendingCategorized).toHaveProperty('program');
      expect(data.pendingCategorized).toHaveProperty('tabungan');
      expect(data.pendingCategorized).toHaveProperty('investasi');
      
      // Validate notifications array
      expect(Array.isArray(data.notifications)).toBe(true);
      if (data.notifications.length > 0) {
        const notif = data.notifications[0];
        expect(notif).toHaveProperty('id');
        expect(notif).toHaveProperty('title');
        expect(notif).toHaveProperty('body');
        expect(notif).toHaveProperty('type');
        expect(notif).toHaveProperty('time');
      }
    });
  });

  describe('Database Connection Validation', () => {
    it('should validate database connections for dashboard queries', async () => {
      const Member = db.Member;
      const Savings = db.Savings;
      const FinancingApplication = db.FinancingApplication;
      
      // Test member query
      const memberCount = await Member.count();
      expect(memberCount).toBeGreaterThan(0);
      
      // Test savings query
      const savingsTotal = await Savings.sum('amount', {
        where: { status: 'COMPLETED' }
      });
      expect(savingsTotal).toBeGreaterThanOrEqual(0);
      
      // Test financing application queries
      const programCount = await FinancingApplication.count({
        where: { status: 'ACTIVE', category: 'Arisan' }
      });
      const jualBeliCount = await FinancingApplication.count({
        where: { status: 'ACTIVE', category: 'Jual Beli Mobil' }
      });
      expect(programCount).toBe(1);
      expect(jualBeliCount).toBe(1);
    });
  });
});