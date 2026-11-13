import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import anggotaRoute from "../routes/anggotaRoute.js";
import jwt from "jsonwebtoken";

/**
 * Setup minimal members API for testing
 * Adds a beforeEach middleware to inject a test JWT for authenticated routes
 */
const app = express();
app.use(express.json());

// Inject test JWT for authenticated anggota routes
app.use("/api/anggota", (req, res, next) => {
  req.userId = 1;
  next();
});

app.use("/api/anggota", anggotaRoute);

beforeEach(() => {
  vi.clearAllMocks();
});

// Generate a test JWT signed with the same secret used in CI
const testSecret = process.env.JWT_SECRET || "test_jwt_secret_key_minimum_32_characters_long";
const testToken = jwt.sign({ member_id: 1 }, testSecret, {
  algorithm: "HS512",
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
    const memberIds = ["uuid-1", "uuid-2", "uuid-3"];
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
    const memberId = "test-uuid-123";
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
    expect(res.body.data.member.id).toBe(1);
  });
});