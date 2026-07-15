import "dotenv/config";
import db from "./models/index.js";

async function testQuery() {
  try {
    const batches = await db.ArisanBatch.findAll({
      where: {
        status: ['ACTIVE', 'OPEN']
      },
      include: [
        {
          model: db.ArisanProgram,
          as: 'program',
          attributes: ['arisan_program_id', 'program_name', 'category', 'target_amount', 'term_months', 'monthly_contribution']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    console.log("Success! Found", batches.length, "batches.");
  } catch (error) {
    console.error("Query failed with error:", error);
  } finally {
    process.exit(0);
  }
}

testQuery();
