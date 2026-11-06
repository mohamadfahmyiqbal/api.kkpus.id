import test from "node:test";
import assert from "node:assert/strict";

test("Deduplication logic - avoids double listing between billing and direct savings", () => {
  const billingItems = [
    {
      id: "tx-1",
      member_id: "mem-123",
      amount: 50000,
      date: "2026-03-01T10:00:00.000Z",
      product_name: "Simpanan Wajib - Maret 2026"
    }
  ];

  const directSavings = [
    {
      savings_id: "sav-dup-1",
      member_id: "mem-123",
      amount: 50000,
      transaction_date: "2026-03-01",
      created_at: "2026-03-01T10:00:00.000Z",
      savings_type: "WAJIB"
    },
    {
      savings_id: "sav-unique-2",
      member_id: "mem-123",
      amount: 50000,
      transaction_date: "2026-02-01",
      created_at: "2026-02-01T10:00:00.000Z",
      savings_type: "WAJIB"
    }
  ];

  const billingKeys = new Set(
    billingItems.map(b => {
      const dateStr = b.date ? new Date(b.date).toISOString().split('T')[0] : '';
      return `${b.member_id}_${parseFloat(b.amount || 0)}_${dateStr}`;
    })
  );

  const filtered = directSavings.filter(s => {
    const sDate = s.transaction_date || (s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : '');
    const key = `${s.member_id}_${parseFloat(s.amount || 0)}_${sDate}`;
    return !billingKeys.has(key);
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].savings_id, "sav-unique-2");
});
