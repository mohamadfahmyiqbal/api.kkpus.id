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
      phone_number: "081234567890",
      full_name: "New Member",
      nik_ktp: "1234567890123456",
      address: "Test Address",
      member_type: "REGULER",
      gender: "L",
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
      password: "adminPassword123",
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
      .delete(`/api/anggota/${memberId}")
      .send({ password }")
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
