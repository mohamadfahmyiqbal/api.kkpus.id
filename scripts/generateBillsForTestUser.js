// PATH: scripts/generateBillsForTestUser.js
import "dotenv/config";
import db from "../models/index.js";
import { createInitialBills } from "../controllers/billing/createInitialBills.js";

async function generateBills() {
  const targetEmail = "test001@gmail.com";
  console.log(`\n======================================================`);
  console.log(`⚡ Generate Tagihan Awal untuk: ${targetEmail}`);
  console.log(`======================================================\n`);

  const t = await db.sequelize.transaction();
  try {
    const member = await db.Member.findOne({ where: { email: targetEmail }, transaction: t });
    if (!member) {
      throw new Error(`Member ${targetEmail} tidak ditemukan`);
    }

    // Cek apakah sudah ada bill items
    const existing = await db.BillItem.findAll({ where: { member_id: member.member_id }, transaction: t });
    console.log(`Tagihan saat ini: ${existing.length}`);

    if (existing.length === 0) {
      console.log(`Membuat tagihan Simpanan Pokok & Wajib (12 bulan)...`);
      const res = await createInitialBills(member.member_id, ["SW_POKOK", "SW_WAJIB"], t, 12);
      console.log(`Hasil createInitialBills:`, res);
    } else {
      console.log(`User sudah memiliki tagihan (${existing.length} items).`);
    }

    await t.commit();

    const items = await db.BillItem.findAll({ where: { member_id: member.member_id } });
    console.log(`\nTotal BillItems sekarang: ${items.length}`);
    items.forEach((item, idx) => {
      console.log(` ${idx + 1}. [${item.status}] ${item.category_code} | ${item.description} | Rp ${item.amount}`);
    });

    console.log(`\n✅ Selesai!`);
    process.exit(0);
  } catch (err) {
    await t.rollback();
    console.error(`❌ Gagal:`, err);
    process.exit(1);
  }
}

generateBills();
