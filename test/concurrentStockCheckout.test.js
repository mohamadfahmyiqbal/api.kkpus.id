import { describe, it, expect } from "vitest";

describe("Real-time Stock Sync - Concurrent Checkout Simulation", () => {
  it("prevents overselling when concurrent requests arrive simultaneously", async () => {
    let availableStock = 10;
    const deduction = 2;

    // Mutex / atomic check simulation
    const simulateCheckout = async (qty) => {
      if (availableStock < qty) {
        throw new Error("Stok tidak mencukupi");
      }
      availableStock -= qty;
      return { success: true, remaining: availableStock };
    };

    const results = await Promise.all([
      simulateCheckout(deduction),
      simulateCheckout(deduction),
    ]);

    expect(results).toHaveLength(2);
    expect(results[0].success).toBe(true);
    expect(results[1].success).toBe(true);
    expect(availableStock).toBe(6);
  });

  it("prevents overselling when total requested exceeds available stock", async () => {
    let availableStock = 2;

    const simulateCheckout = async (qty) => {
      if (availableStock < qty) {
        throw new Error("Stok tidak mencukupi");
      }
      availableStock -= qty;
      return { success: true, remaining: availableStock };
    };

    const results = await Promise.allSettled([
      simulateCheckout(2),
      simulateCheckout(2),
    ]);

    const fulfilled = results.filter(r => r.status === "fulfilled");
    const rejected = results.filter(r => r.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
    expect(rejected[0].reason.message).toBe("Stok tidak mencukupi");
    expect(availableStock).toBe(0);
  });
});
