import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import anggotaRoute from "../routes/anggotaRoute.js";

// Setup minimal members API for testing
const app = express();
app.use(express.json());
app.use("/api/anggota", anggotaRoute);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Members Module Test", () => {
  it("GET /anggota/all - returns list of members", async () => {
    const res = await request(app).get("/api/anggota/all").expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.members)).toBe(true);
  });

  it("GET /anggota/:id - returns member by ID", async () => {
    const memberId = "test-uuid-123";
    const res = await request(app)
      .get(`/api/anggota/${memberId}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.member.id).toBe(memberId);
  });

  it("POST /anggota - creates new member", async () => {
    const newMember = {
      email: "newmember@example.com",
      phoneNumber: "081234567890",
      fullName: "New Member",
      nikKtp: "1234567890123456",
      address: "Test Address",
      memberType: "REGULER",
      gender: "L",
      dateOfBirth: "1990-01-01",
      joinDate: "2024-01-01",
    };

    const res = await request(app)
      .post("/api/anggota")
      .send(newMember)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.member.email).toBe(newMember.email);
  });

  it("DELETE /anggota/:id - deletes member with password confirmation", async () => {
    const memberId = "test-uuid-123";
    const password = "adminPassword123";

    const res = await request(app)
      .delete(`/api/anggota/${memberId}`)
      .send({ password })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Berhasil");
  });

  it("POST /anggota/batch-delete - deletes multiple members", async () => {
    const memberIds = ["uuid-1", "uuid-2", "uuid-3"];
    const password = "adminPassword123";

    const res = await request(app)
      .post("/api/anggota/batch-delete")
      .send({ member_ids: memberIds, password })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Berhasil");
  });
});
