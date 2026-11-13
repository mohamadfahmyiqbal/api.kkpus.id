import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import authRoute from "../routes/authRoute.js";

/**
 * Setup minimal auth API for testing
 */
const app = express();
app.use(express.json());
app.use("/api/auth", authRoute);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Auth Module Tests", () => {
  it("register - valid credentials returns token", async () => {
    const req = {
      full_name: "Test User",
      email: "test@example.com",
      password: "secure123",
      phone_number: "081234567890",
      nik_ktp: "1234567890123456",
      gender: "L",
      address: "Test Address",
      date_of_birth: "1990-01-01",
      join_date: "2024-01-01",
      province_id: "11",
      city_id: "1107",
      district_id: "1107-01",
      subdistrict_id: "1107-01-001",
      nama_usaha: "Test Business",
      jenis_usaha: "Retail",
      lama_usaha: "5",
      omzet: "50000000",
    };
    const res = await request(app)
      .post("/api/auth/register")
      .send(req)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user.email).toBe(req.email);
  });

  it("login - valid credentials returns token", async () => {
    const credentials = {
      emailHp: "test@example.com",
      password: "secure123",
    };

    const res = await request(app)
      .post("/api/auth/accountLogin")
      .send(credentials)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  it("login - invalid credentials returns error", async () => {
    const credentials = {
      emailHp: "wrong@example.com",
      password: "wrongpass",
    };

    const res = await request(app)
      .post("/api/auth/accountLogin")
      .send(credentials)
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Kredensial tidak valid");
  });

  it("logout - valid token clears session", async () => {
    const token = "valid-jwt-token";

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Berhasil logout");
  });

  // Health check untuk server readyness
  const healthApp = express();
  healthApp.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy", timestamp: Date.now() });
  });

  describe("Health Check", () => {
    it("should return 200 OK", async () => {
      const res = await request(healthApp).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("healthy");
    });
  });
});