import db from "./models/index.js";

async function test() {
  const savings = await db.Savings.findAll({
    attributes: ['savings_type', 'status', 'amount']
  });
  console.log(JSON.stringify(savings, null, 2));
  process.exit(0);
}
test();
