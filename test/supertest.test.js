import { describe, it, expect } from "vitest";
import request from "supertest";
import express from "express";

// Minimal smoke test for supertest + vitest
describe("Supertest Smoke Test", () => {
  it("harus merespons GET /health dengan 200 OK", async () => {
    const app = express();
    app.get("/health", (req, res) => {
      res.status(200).json({ status: "healthy", timestamp: Date.now() });
    });

    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("healthy");
  });
});
