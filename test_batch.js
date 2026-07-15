import db from "./models/index.js";

async function test() {
  const participants = await db.ArisanParticipant.findAll({
    where: { arisan_batch_id: "992e3b26-3e9d-488f-96fe-2a9d1f2675b5" },
    raw: true
  });
  console.log("Participants:");
  console.log(participants);
  process.exit(0);
}
test();
