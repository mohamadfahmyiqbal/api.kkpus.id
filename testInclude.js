import db from "./models/index.js";
import { Op } from "sequelize";

async function run() {
  const data = await db.SavingsWithdrawal.findByPk('7da294b0-ffcb-479f-bdd1-535ad155aa4f', {
    include: [
      {
        model: db.Approval,
        as: "approvals",
        where: { 
          entity_ref: {
            [Op.in]: ['savings_withdrawal', 'tabungan_withdrawals']
          } 
        },
        required: false,
      }
    ]
  });
  console.log(JSON.stringify(data.approvals, null, 2));
  process.exit(0);
}

run();
