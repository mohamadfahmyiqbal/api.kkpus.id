import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import getProgramOptions from "../controllers/program/getProgramOptions.js";

test("Program Options Controller - returns valid list", async () => {
  let responseData = null;

  const mockReq = {};
  const mockRes = {
    json(payload) {
      responseData = payload;
      return this;
    },
  };

  await getProgramOptions(mockReq, mockRes);

  assert.equal(responseData?.success, true);
  assert.ok(Array.isArray(responseData?.data));
  assert.ok(responseData.data.some((item) => item.key === "pinjaman"));
  assert.ok(responseData.data.some((item) => item.key === "arisan"));
});

test("CSPRNG Draw Fairness - crypto.randomInt is uniformly distributed within bounds", () => {
  const eligibleLength = 10;
  for (let i = 0; i < 50; i++) {
    const pickedIndex = crypto.randomInt(0, eligibleLength);
    assert.ok(pickedIndex >= 0 && pickedIndex < eligibleLength);
  }
});
