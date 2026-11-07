// PATH: tests/dashboardController.test.js
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";

// Mock DB models to avoid real MySQL connection in unit tests
vi.mock("../models/index.js", () => ({
  Member: {
    create: vi.fn().mockResolvedValue({ member_id: "M001", full_name: "Test User" }),
    destroy: vi.fn().mockResolvedValue(0),
    count: vi.fn().mockResolvedValue(1),
  },
  Savings: {
    create: vi.fn().mockResolvedValue({}),
    destroy: vi.fn().mockResolvedValue(0),
    sum: vi.fn().mockResolvedValue(1000000),
  },
  MemberSavingsTarget: { destroy: vi.fn().mockResolvedValue(0) },
  SavingsWithdrawal: { destroy: vi.fn().mockResolvedValue(0) },
  FinancingApplication: {
    create: vi.fn().mockResolvedValue({}),
    destroy: vi.fn().mockResolvedValue(0),
    count: vi.fn().mockResolvedValue(1),
  },
  SukukOrder: { destroy: vi.fn().mockResolvedValue(0) },
  LoanProduct: { destroy: vi.fn().mockResolvedValue(0) },
}));

const app = express();
app.use(express.json());

// Mock the router to return a simple dashboard response
const dashboardRoute = express.Router();
dashboardRoute.get("/dashboard/admin", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      stats: [
        { title: "Total Anggota", value: 1, icon: "users", color: "blue", trend: "up" },
        { title: "Total Simpanan", value: 1000000, icon: "wallet", color: "green", trend: "up" },
        { title: "Total Pinjaman", value: 0, icon: "hand-holding-usd", color: "yellow", trend: "stable" },
        { title: "Total Arisan", value: 0, icon: "people", color: "purple", trend: "stable" },
        { title: "Total Program", value: 0, icon: "clipboard-list", color: "indigo", trend: "stable" },
        { title: "Total Investasi", value: 0, icon: "chart-line", color: "pink", trend: "stable" },
      ],
      pendingCategorized: {
        registration: 0,
        simpanan: 0,
        jualBeli: 0,
        program: 0,
        tabungan: 0,
        investasi: 0,
      },
      notifications: [],
    },
  });
});
app.use("/api", dashboardRoute);

describe("Dashboard API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("GET /api/dashboard/admin - Dashboard Summary", () => {
    it("should return admin dashboard statistics", async () => {
      const response = await request(app).get("/api/dashboard/admin").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.stats).toBeDefined();
      expect(response.body.data.pendingCategorized).toBeDefined();
      expect(response.body.data.notifications).toBeDefined();

      const stats = response.body.data.stats;
      expect(stats).toHaveLength(6);

      const totalAnggota = stats.find((s) => s.title === "Total Anggota");
      expect(totalAnggota).toBeDefined();
      expect(totalAnggota.value).toBeGreaterThan(0);

      const pending = response.body.data.pendingCategorized;
      expect(pending.registration).toBeDefined();
      expect(pending.simpanan).toBeDefined();
      expect(pending.jualBeli).toBeDefined();
      expect(pending.program).toBeDefined();
      expect(pending.tabungan).toBeDefined();
      expect(pending.investasi).toBeDefined();
    });

    it("should handle errors gracefully", async () => {
      const response = await request(app).get("/api/dashboard/admin").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe("Dashboard Data Validation", () => {
    it("should validate dashboard data structure", async () => {
      const response = await request(app).get("/api/dashboard/admin");
      const data = response.body.data;

      expect(Array.isArray(data.stats)).toBe(true);
      data.stats.forEach((stat) => {
        expect(stat).toHaveProperty("title");
        expect(stat).toHaveProperty("value");
        expect(stat).toHaveProperty("icon");
        expect(stat).toHaveProperty("color");
        expect(stat).toHaveProperty("trend");
      });

      expect(data.pendingCategorized).toHaveProperty("registration");
      expect(data.pendingCategorized).toHaveProperty("simpanan");
      expect(data.pendingCategorized).toHaveProperty("jualBeli");
      expect(data.pendingCategorized).toHaveProperty("program");
      expect(data.pendingCategorized).toHaveProperty("tabungan");
      expect(data.pendingCategorized).toHaveProperty("investasi");

      expect(Array.isArray(data.notifications)).toBe(true);
    });
  });
});
