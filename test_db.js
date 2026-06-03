import db from "./models/index.js";

async function main() {
  try {
    const memberId = '2ba91920-7731-4fee-8b51-afe996cf91bd';
    const member = await db.Member.findByPk(memberId);
    console.log("=== MEMBER INFO ===");
    if (member) {
      console.log({
        member_id: member.member_id,
        full_name: member.full_name,
        member_no: member.member_no,
        member_type: member.member_type,
        is_registration_done: member.is_registration_done,
        status_id: member.status_id
      });
    } else {
      console.log("Member not found in database!");
    }
  } catch (err) {
    console.error(err);
  } finally {
    await db.sequelize.close();
  }
}

main();
