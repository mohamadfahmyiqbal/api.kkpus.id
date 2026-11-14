import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import request from "supertest";
import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "../routes/authRoute.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { ensureTestSchema } from "./setupDb.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoute);

// Mock all database-dependent services before app initialization
vi.mock("../services/authLoggingService", () => ({
  logLoginAttempt: vi.fn(),
  checkAccountLockout: vi.fn(() => ({ locked: false, message: "Login successful" })),
  updateAccountLockout: vi.fn(),
  createAccountLockoutTermination: vi.fn(),
}));

vi.mock("../utils/tokenBlacklist", () => ({
  blacklistToken: vi.fn(),
  isTokenBlacklisted: vi.fn(() => false),
}));

beforeAll(async () => {
  await ensureTestSchema();
});

beforeEach(async () => {
  vi.clearAllMocks();
});

describe("Auth Module Tests", () => {
  let registeredEmail = "";
  const registeredPassword = "Password123!";

  it("register - valid credentials returns token", async () => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    registeredEmail = `test-${crypto.randomUUID()}@example.com`;
    const req = {
      full_name: "Test User",
      email: registeredEmail,
      password: registeredPassword,
      phone_number: `0812${randomSuffix}90`,
      nik_ktp: `3201${randomSuffix}${Math.floor(100000 + Math.random() * 900000)}`.slice(0, 16),
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
    const res = await request(app).post("/api/auth/register").send(req).expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
    expect(res.body.data.user.email).toBe(req.email);
  });

  it("login - valid credentials returns token", async () => {
    const testSecret =
      process.env.JWT_SECRET || "test_jwt_secret_key_minimum_32_characters_long";
    const testToken = jwt.sign(
      { member_id: 1, role: "Admin" },
      testSecret,
      { algorithm: "HS512", expiresIn: "1d" }
    );

    // Get CSRF token first
    const csrfRes = await request(app).get("/api/auth/csrf-token");
    const csrfToken = csrfRes.body.csrfToken;
    const setCookieHeader = csrfRes.headers["set-cookie"];
    const csrfCookieValue =
      Array.isArray(setCookieHeader)
        ? setCookieHeader[0].split(";")[0]
        : setCookieHeader?.split(";")[0] || "";

    const credentials = {
      emailHp: registeredEmail,
      password: registeredPassword,
    };

    const res = await request(app)
      .post("/api/auth/accountLogin")
      .send(credentials)
      .set("Authorization", `Bearer ${testToken}`)
      .set("Cookie", csrfCookieValue)
      .set("x-xsrf-token", csrfToken)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token");
  });

  it("login - invalid credentials returns error", async () => {
    const testSecret =
      process.env.JWT_SECRET || "test_jwt_secret_key_minimum_32_characters_long";
    const testToken = jwt.sign(
      { member_id: 1, role: "Admin" },
      testSecret,
      { algorithm: "HS512", expiresIn: "1d" }
    );

    const csrfRes = await request(app).get("/api/auth/csrf-token");
    const csrfToken = csrfRes.body.csrfToken;
    const setCookieHeader = csrfRes.headers["set-cookie"];
    const csrfCookieValue =
      Array.isArray(setCookieHeader)
        ? setCookieHeader[0].split(";")[0]
        : setCookieHeader?.split(";")[0] || "";

    const credentials = {
      emailHp: "wrong@example.com",
      password: "Wrongpass123!",
    };

    const res = await request(app)
      .post("/api/auth/accountLogin")
      .send(credentials)
      .set("Authorization", `Bearer ${testToken}`)
      .set("Cookie", csrfCookieValue)
      .set("x-xsrf-token", csrfToken)
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Kredensial tidak valid");
  });

  it("logout - valid token clears session", async () => {
    const testSecret =
      process.env.JWT_SECRET || "test_jwt_secret_key_minimum_32_characters_long";
    const testToken = jwt.sign(
      { member_id: 1, role: "Admin" },
      testSecret,
      { algorithm: "HS512", expiresIn: "1d" }
    );

    const csrfRes = await request(app).get("/api/auth/csrf-token");
    const csrfToken = csrfRes.body.csrfToken;
    const setCookieHeader = csrfRes.headers["set-cookie"];
    const csrfCookieValue =
      Array.isArray(setCookieHeader)
        ? setCookieHeader[0].split(";")[0]
        : setCookieHeader?.split(";")[0] || "";

    const res = await request(app)
      .post("/api/auth/logout")
      .send({ password: "adminPassword123" })
      .set("Authorization", `Bearer ${testToken}`)
      .set("Cookie", csrfCookieValue)
      .set("x-xsrf-token", csrfToken)
      .expect(200);

    expect(res.body.status).toBe(true);
    expect(res.body.message).toContain("Logout berhasil");
  });
});
