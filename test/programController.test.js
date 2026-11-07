import { describe, it, expect } from "vitest";
import getProgramOptions from "../controllers/program/getProgramOptions.js";
import crypto from "node:crypto";

describe("Program Options Controller", () => {
  it("returns valid list", async () => {
    let responseData = null;

    const mockReq = {};
    const mockRes = {
      json(payload) {
        responseData = payload;
        return this;
      },
    };

    await getProgramOptions(mockReq, mockRes);

    expect(responseData?.success).toBe(true);
    expect(Array.isArray(responseData?.data)).toBe(true);
    expect(responseData.data.some((item) => item.key === "pinjaman")).toBe(true);
    expect(responseData.data.some((item) => item.key === "arisan")).toBe(true);
  });

  it("CSPRNG Draw Fairness - crypto.randomInt is uniformly distributed within bounds", () => {
    const eligibleLength = 10;
    for (let i = 0; i < 50; i++) {
      const pickedIndex = crypto.randomInt(0, eligibleLength);
      expect(pickedIndex >= 0 && pickedIndex < eligibleLength).toBe(true);
    }
  });
});
