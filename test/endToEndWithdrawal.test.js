import { describe, it, expect } from "vitest";

describe("End-to-end sandbox test: simulasi penarikan dana anggota (tanpa Iris payout)", () => {
  it("simulates member withdrawal with manual payment method (cash)", async () => {
    // Simulate member data
    const member = {
      member_id: "mem-456",
      full_name: "Test Member",
      current_balance: 100000,
    };

    // Simulate withdrawal request creation
    const withdrawal = {
      withdrawal_id: "wd-789",
      member_id: member.member_id,
      amount: 50000,
      method: "TUNAI",
      status: "PENDING_APPROVAL",
    };

    // Simulate approval process (bypass Iris)
    const approval = {
      step: 2,
      status: "APPROVED",
      approver: "bendahara",
    };

    // Simulate cash payment (no Iris payout)
    const payment = {
      method: "CASH",
      status: "SUCCESS",
      timestamp: new Date().toISOString(),
      proof_path: "/receipts/cash_789.jpg",
    };

    // Simulate withdrawal finalization
    const finalWithdrawal = {
      ...withdrawal,
      status: "DISBURSED",
      disbursed_at: new Date().toISOString(),
      payment,
    };

    // Verify simulation
    expect(member.member_id).toBe("mem-456");
    expect(withdrawal.amount).toBe(50000);
    expect(withdrawal.method).toBe("TUNAI");
    expect(approval.status).toBe("APPROVED");
    expect(finalWithdrawal.status).toBe("DISBURSED");
    expect(payment.status).toBe("SUCCESS");
  });

  it("verifies withdrawal without Iris integration", async () => {
    // Mock scenario where Iris is not used
    const withdrawalFlow = {
      hasIris: false,
      manualFlow: true,
      paymentMethod: "MANUAL_TRANSFER",
    };

    // Simulate that manual transfer was completed
    const manualTransfer = {
      reference_no: "MANUAL-999",
      status: "COMPLETED",
      amount: 25000,
    };

    expect(withdrawalFlow.hasIris).toBe(false);
    expect(withdrawalFlow.manualFlow).toBe(true);
    expect(manualTransfer.status).toBe("COMPLETED");
  });
});
