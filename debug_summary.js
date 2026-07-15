import db from './models/index.js';
import { Sequelize } from 'sequelize';

async function run() {
    const summaryData = await db.MemberSavingsAccount.findAll({
      attributes: [
        [Sequelize.fn("SUM", Sequelize.col("current_balance")), "total_balance"],
        [Sequelize.col("savingsProduct.name"), "product_name"]
      ],
      include: [
        {
          model: db.SavingsProduct,
          as: "savingsProduct",
          attributes: [],
          required: true
        }
      ],
      group: ["savingsProduct.name"],
      raw: true
    });
    console.log(summaryData);
}

run().catch(console.error).finally(() => process.exit());
