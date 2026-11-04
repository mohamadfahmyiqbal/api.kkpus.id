import test from "node:test";
import assert from "node:assert/strict";
import { applySavingsTarget } from "../controllers/savings/applySavingsTarget.js";

test("Tabungan - applySavingsTarget rejects missing or negative values", async () => {
  let statusCode = null;
  let responseData = null;

  const mockReq = {
    userId: 1,
    body: {
      saving_target_id: 1,
      monthly_deposit: -10000,
      term_months: 12
    }
  };

  const mockRes = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      responseData = payload;
      return this;
    }
  };

  await applySavingsTarget(mockReq, mockRes);

  assert.equal(statusCode, 400);
  assert.equal(responseData?.status, false);
  assert.match(responseData?.message, /Data pengajuan tidak lengkap atau nominal\/durasi tidak valid/);
});

test("Tabungan - applySavingsTarget rejects zero term duration", async () => {
  let statusCode = null;
  let responseData = null;

  const mockReq = {
    userId: 1,
    body: {
      saving_target_id: 1,
      monthly_deposit: 100000,
      term_months: 0
    }
  };

  const mockRes = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      responseData = payload;
      return this;
    }
  };

  await applySavingsTarget(mockReq, mockRes);

  assert.equal(statusCode, 400);
  assert.equal(responseData?.status, false);
  assert.match(responseData?.message, /Data pengajuan tidak lengkap atau nominal\/durasi tidak valid/);
});
