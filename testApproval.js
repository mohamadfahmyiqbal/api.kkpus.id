import db from "./models/index.js";

async function run() {
  const data = await db.Approval.findAll({
    where: { entity_id: '7da294b0-ffcb-479f-bdd1-535ad155aa4f' }
  });
  console.log(data.map(a => a.toJSON()));
  process.exit(0);
}

run();
