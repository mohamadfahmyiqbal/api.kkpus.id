import db from './models/index.js';
import { Sequelize } from "sequelize";

async function run() {
  try {
    const list = await db.SavingsReportList.findAll({
      order: [["nama", "ASC"]]
    });
    
    // Add Aggregated Summary for Neraca & Jurnal
    const summary = await db.MemberSavingsAccount.findAll({
      attributes: [
        [Sequelize.literal("SUM(CASE WHEN `savingsProduct`.`name` LIKE '%POKOK%' THEN current_balance ELSE 0 END)"), "total_pokok"],
        [Sequelize.literal("SUM(CASE WHEN `savingsProduct`.`name` LIKE '%WAJIB%' THEN current_balance ELSE 0 END)"), "total_wajib"],
        [Sequelize.literal("SUM(CASE WHEN `savingsProduct`.`name` NOT LIKE '%POKOK%' AND `savingsProduct`.`name` NOT LIKE '%WAJIB%' THEN current_balance ELSE 0 END)"), "total_sukarela"],
        [Sequelize.fn("SUM", Sequelize.col("current_balance")), "total_all"]
      ],
      include: [
        {
          model: db.SavingsProduct,
          as: "savingsProduct",
          attributes: []
        }
      ],
      raw: true
    });
    
    console.log("List Count:", list.length);
    console.log("First List Item:", JSON.stringify(list[0], null, 2));
    console.log("Summary:", summary);
  } catch(e) {
    console.error("ERROR:", e);
  }
}

run().catch(console.error).finally(() => process.exit());
