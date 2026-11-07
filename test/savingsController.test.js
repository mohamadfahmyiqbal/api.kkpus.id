import { describe, it, expect } from "vitest";
import { applySavingsTarget } from "../controllers/savings/applySavingsTarget.js";

describe("Savings Controller", () => {
  it("applySavingsTarget rejects missing or negative values", async () => {
    let statusCode = null;
    let responseData = null;

    const mockReq = {
      userId: 1,
      body: {
        saving_target_id: 1,
        monthly_deposit: -10000,
        term_months: 12,
      },
    };

    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(payload) {
        responseData = payload;
        return this;
      },
    };

    await applySavingsTarget(mockReq, mockRes);

    expect(statusCode).toBe(400);
    expect(responseData?.status).toBe(false);
    expect(responseData?.message).toMatch(/Data pengajuan tidak lengkap atau nominal\/durasi tidak valid/);
  });

  it("applySavingsTarget rejects zero term duration", async () => {
    let statusCode = null;
    let responseData = null;

    const mockReq = {
      userId: 1,
      body: {
        saving_target_id: 1,
        monthly_deposit: 100000,
        term_months: 0,
      },
    };

    const mockRes = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(payload) {
        responseData = payload;
        return this;
      },
    };

    await applySavingsTarget(mockReq, mockRes);

    expect(statusCode).toBe(400);
    expect(responseData?.status).toBe(false);
    expect(responseData?.message).toMatch(/Data pengajuan tidak lengkap atau nominal\/durasi tidak valid/);
  });

  it("getAdminSavingsMemberAggregates module exports handler", async () => {
    const { getAdminSavingsMemberAggregates } = await import("../controllers/savings/getAdminSavingsMemberAggregates.js");
    expect(typeof getAdminSavingsMemberAggregates).toBe("function");
  });
});
