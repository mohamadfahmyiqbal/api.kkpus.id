import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import anggotaRoute from "../routes/anggotaRoute.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import db from "../models/index.js";
import crypto from "crypto";

dotenv.config();

const adminTestId = "00000000-0000-0000-0000-000000000001";

/**
 * Setup minimal members API for testing with mocked services
 */
const app = express();
app.use(express.json());
app.use("/api/anggota", (req, res, next) => {
  // Set authenticated test admin user ID
  req.userId = adminTestId;
  next();
});
app.use("/api/anggota", anggotaRoute);

beforeEach(() => {
  vi.clearAllMocks();
});

// Generate a test JWT with proper role assignment
const testSecret = process.env.JWT_SECRET || "test_jwt_secret_key_minimum_32_characters_long";
const testToken = jwt.sign({ 
  member_id: adminTestId,
  role: "Admin" 
}, testSecret, {
  algorithm: "HS512",
  expiresIn: "1d"
});

describe("Members Module Test", () => {
  it("GET /anggota/all - returns list of members", async () => {
    const res = await request(app)
      .get("/api/anggota/all")
      .set("Authorization", `Bearer ${testToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.members)).toBe(true);
  });

  it("GET /anggota/roles - returns available roles", async () => {
    const res = await request(app)
      .get("/api/anggota/roles")
      .set("Authorization", `Bearer ${testToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("POST /anggota/batch-delete - deletes multiple members", async () => {
    // Re-seed targets before deletion so repeat test runs never 404
    const memberIds = [
      crypto.randomUUID(),
      crypto.randomUUID()
    ];
    for (const mId of memberIds) {
      await db.Member.create({
        member_id: mId,
        member_no: `BAT_${mId.slice(0, 8)}`,
        full_name: "Batch Delete Target",
        email: `${mId}@example.com`,
      }).catch(() => {});
    }
    const password = "adminPassword123";

    const res = await request(app)
      .post("/api/anggota/batch-delete")
      .send({ member_ids: memberIds, password })
      .set("Authorization", `Bearer ${testToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Berhasil");
  });

  it("DELETE /anggota/:member_id - deletes member with password confirmation", async () => {
    // Create new disposable member before deleting to guarantee it exists every test run
    const memberId = crypto.randomUUID();
    await db.Member.create({
      member_id: memberId,
      member_no: `DEL_${memberId.slice(0, 8)}`,
      full_name: "Disposable Target",
      email: `${memberId}@example.com`,
    });
    const password = "adminPassword123";

    const res = await request(app)
      .delete(`/api/anggota/${memberId}`)
      .send({ password })
      .set("Authorization", `Bearer ${testToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Berhasil");
  });

  it("GET /anggota/profil - returns member profile", async () => {
    const res = await request(app)
      .get("/api/anggota/profil")
      .set("Authorization", `Bearer ${testToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("member_id");
  });
});