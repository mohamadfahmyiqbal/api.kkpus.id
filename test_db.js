import db from './models/index.js';

async function test() {
  const member = await db.Member.findOne();
  console.log("Member Type is:", member?.member_type);
  process.exit(0);
}
test();
