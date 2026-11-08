import { describe, it, expect, vi } from "vitest";
import { calculateFlatMargin, calculateAnnuityMargin } from "../services/financingCalculationHelper.js";

describe("Simulation: Perhitungan Margin Flat vs Anuitas Syariah", () => {
  it("calculates flat margin correctly", () => {
    const principal = 100000000;
    const marginPercent = 12;
    const downPayment = 20000000;
    const tenureMonths = 60;
    
    const flatResult = calculateFlatMargin(principal + downPayment, marginPercent, downPayment, tenureMonths);
    
    expect(flatResult).toMatchObject({
      margin_percent: marginPercent,
      margin_amount: Math.round(principal * (marginPercent / 100)),
      total_tagihan: principal + Math.round(principal * (marginPercent / 100)),
      monthly_installment: Math.ceil((principal + Math.round(principal * (marginPercent / 100))) / tenureMonths),
    });
  });

  it("calculates annuity margin with reasonable values", () => {
    const principal = 100000000;
    const marginPercent = 12;
    const downPayment = 20000000;
    const tenureMonths = 60;
    
    const annuityResult = calculateAnnuityMargin(principal + downPayment, marginPercent, downPayment, tenureMonths);
    
    expect(annuityResult).toMatchObject({
      margin_percent: marginPercent,
      margin_amount: Math.round(principal * (marginPercent / 100) * 0.5),
      total_tagihan: principal + Math.round(principal * (marginPercent / 100) * 0.5),
      monthly_installment: Math.ceil((principal + Math.round(principal * (marginPercent / 100) * 0.5)) / tenureMonths),
    });
  });
});
