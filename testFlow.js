import db from "./models/index.js";

async function run() {
  const data = await db.ApprovalFlow.findAll({
    include: [
      {
        model: db.ApprovalStep,
        as: "steps",
        include: [{ model: db.UserRole, as: "verifierRole" }]
      }
    ]
  });
  console.log(JSON.stringify(data.map(a => a.toJSON()), null, 2));
  process.exit(0);
}

run();
