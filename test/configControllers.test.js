import { describe, it, expect } from "vitest";
import {
  isAllowedAkad,
  parseNonNegativeAmount,
  parsePaymentFeeInput,
} from "../controllers/savings/configValidation.js";

describe("Config Validation", () => {
  it("Akad menolak tipe di luar daftar dan nilai kosong", () => {
    expect(isAllowedAkad("Hibah")).toBe(false);
    expect(isAllowedAkad("")).toBe(false);
    expect(isAllowedAkad("Wadiah")).toBe(true);
  });

  it("Nominal simpanan menolak negatif, teks, dan kosong; menerima nol", () => {
    expect(parseNonNegativeAmount(-1)).toBe(null);
    expect(parseNonNegativeAmount("abc")).toBe(null);
    expect(parseNonNegativeAmount("")).toBe(null);
    expect(parseNonNegativeAmount("0")).toBe(0);
    expect(parseNonNegativeAmount("150000.50")).toBe(150000.5);
  });

  it("Biaya admin menolak persentase di atas 100 dan tipe di luar enum", () => {
    expect(
      parsePaymentFeeInput({ id: 1, fee_type: "PERCENTAGE", flat_fee: 0, percentage_fee: 150 }),
    ).toBe(null);
    expect(
      parsePaymentFeeInput({ id: 1, fee_type: "FREE", flat_fee: 0, percentage_fee: 1 }),
    ).toBe(null);
    expect(
      parsePaymentFeeInput({ id: 1, fee_type: "PERCENTAGE", flat_fee: "0", percentage_fee: "0.70" }),
    ).toEqual({ id: 1, fee_type: "PERCENTAGE", flat_fee: 0, percentage_fee: 0.7 });
  });
});
