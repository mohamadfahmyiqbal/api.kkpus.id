import db from './models/index.js';

async function run() {
  const list = await db.SavingsReportList.findAll();
  console.log("savings_report_lists:");
  list.forEach(l => {
    if (l.tahun_ini_total > 0) {
      console.log(`Member: ${l.member_id}, Pokok: ${l.tahun_ini_pokok}, Wajib: ${l.tahun_ini_wajib}, Sukarela: ${l.tahun_ini_sukarela}, Total: ${l.tahun_ini_total}`);
    }
  });
}

run().catch(console.error).finally(() => process.exit());
