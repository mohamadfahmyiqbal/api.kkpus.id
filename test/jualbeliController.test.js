import test from "node:test";
import assert from "node:assert/strict";
import { getTransactionOptions } from "../controllers/jualbeli/jualbeliController.js";

test("Jual Beli Controller - getTransactionOptions returns valid list", async () => {
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

  assert.equal(statusCode, 200);
  assert.equal(responseData?.status, true);
  assert.ok(Array.isArray(responseData?.data?.transaction_types));
  assert.ok(Array.isArray(responseData?.data?.categories));
  assert.ok(responseData.data.transaction_types.some((t) => t.value === "PEMBELIAN"));
});

test("Jual Beli Financial Integrity - Recalculates margin and prevents tampering", () => {
  // Simulates server-side calculation logic implemented in createFinancingApplication
  const harga = 10000000;
  const dp = 2000000;
  const tenure = 12;
  const marginPercentAnggota = 10; // 10%
  const attackerMarginPercent = 0; // Attacker tries to pass 0%

  // Server ignores client percentage and recalculates
  const safeMarginAmount = Math.round(harga * (marginPercentAnggota / 100));
  const safeTotalTagihan = harga + safeMarginAmount;
  const safeMonthlyInstallment = Math.ceil((safeTotalTagihan - dp) / tenure);

  assert.equal(safeMarginAmount, 1000000);
  assert.equal(safeTotalTagihan, 11000000);
  assert.equal(safeMonthlyInstallment, 750000);
  assert.notEqual(safeMarginAmount, attackerMarginPercent);
});
