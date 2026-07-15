import db from './models/index.js';
import { Op } from "sequelize";

async function run() {
  try {
    const type = "POKOK";
    const search = "";
    
    const { count: tCount, rows: transactions } = await db.Transaction.findAndCountAll({
      where: {
        status: "PAID",
      },
      include: [
        {
          model: db.Member,
          as: "member",
          attributes: ["full_name", "member_id"],
        },
        {
          model: db.Bill,
          as: "bill",
          required: true,
          include: [
            {
              model: db.BillItem,
              as: "items",
              required: true,
              where: {
                [Op.or]: [
                  { description: { [Op.like]: `%${type}%` } },
                  { category_code: { [Op.like]: `%${type}%` } }
                ]
              },
              attributes: ["amount", "description"]
            }
          ]
        }
      ],
      order: [["created_at", "DESC"]],
      limit: 10,
      offset: 0
    });
    
    console.log("Success! Count:", tCount);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

run();
