import test from "node:test";
import assert from "node:assert/strict";
import {
  isAllowedAkad,
  parseNonNegativeAmount,
  parsePaymentFeeInput,
} from "../controllers/savings/configValidation.js";

test("Akad menolak tipe di luar daftar dan nilai kosong", () => {
  assert.equal(isAllowedAkad("Hibah"), false);
  assert.equal(isAllowedAkad(""), false);
  assert.equal(isAllowedAkad("Wadiah"), true);
});

test("Nominal simpanan menolak negatif, teks, dan kosong; menerima nol", () => {
  assert.equal(parseNonNegativeAmount(-1), null);
  assert.equal(parseNonNegativeAmount("abc"), null);
  assert.equal(parseNonNegativeAmount(""), null);
  assert.equal(parseNonNegativeAmount("0"), 0);
  assert.equal(parseNonNegativeAmount("150000.50"), 150000.5);
});

test("Biaya admin menolak persentase di atas 100 dan tipe di luar enum", () => {
  assert.equal(
    parsePaymentFeeInput({ id: 1, fee_type: "PERCENTAGE", flat_fee: 0, percentage_fee: 150 }),
    null
  );
  assert.equal(
    parsePaymentFeeInput({ id: 1, fee_type: "FREE", flat_fee: 0, percentage_fee: 1 }),
    null
  );
  assert.deepEqual(
    parsePaymentFeeInput({ id: 1, fee_type: "PERCENTAGE", flat_fee: "0", percentage_fee: "0.70" }),
    { id: 1, fee_type: "PERCENTAGE", flat_fee: 0, percentage_fee: 0.7 }
  );
});
