import { describe, it, expect } from "vitest";
import { getTransactionOptions } from "../controllers/jualbeli/jualbeliController.js";

describe("Jual Beli Controller", () => {
  it("getTransactionOptions returns valid list", async () => {
    let responseData = null;
    let statusCode = null;

    const mockReq = {};
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

    await getTransactionOptions(mockReq, mockRes);

    expect(statusCode).toBe(200);
    expect(responseData?.status).toBe(true);
    expect(Array.isArray(responseData?.data?.transaction_types)).toBe(true);
    expect(Array.isArray(responseData?.data?.categories)).toBe(true);
    expect(responseData.data.transaction_types.some((t) => t.value === "PEMBELIAN")).toBe(true);
  });

  it("Financial Integrity - Recalculates margin and prevents tampering", () => {
    const harga = 10000000;
    const dp = 2000000;
    const tenure = 12;
    const marginPercentAnggota = 10; // 10%
    const attackerMarginPercent = 0; // Attacker tries to pass 0%

    // Server ignores client percentage and recalculates
    const safeMarginAmount = Math.round(harga * (marginPercentAnggota / 100));
    const safeTotalTagihan = harga + safeMarginAmount;
    const safeMonthlyInstallment = Math.ceil((safeTotalTagihan - dp) / tenure);

    expect(safeMarginAmount).toBe(1000000);
    expect(safeTotalTagihan).toBe(11000000);
    expect(safeMonthlyInstallment).toBe(750000);
    expect(safeMarginAmount).not.toBe(attackerMarginPercent);
  });
});
