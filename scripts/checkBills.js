// PATH: scripts/checkBills.js
import "dotenv/config";
import db from "../models/index.js";

async function checkBills() {
  const targetEmail = "test001@gmail.com";
  console.log(`\n======================================================`);
  console.log(`🔍 Memeriksa Kondisi User & Tagihan: ${targetEmail}`);
  console.log(`======================================================\n`);

  try {
    const member = await db.Member.findOne({ where: { email: targetEmail } });
    if (!member) {
      console.log("❌ Member tidak ditemukan");
      process.exit(1);
    }

    console.log("Member:", {
      id: member.member_id,
      name: member.full_name,
      member_type: member.member_type,
      status_id: member.status_id,
      is_registration_done: member.is_registration_done,
    });

    const reg = await db.MemberRegistration.findOne({ where: { member_id: member.member_id } });
    console.log("Registration:", {
      id: reg?.registration_id,
      current_step_id: reg?.current_step_id,
      final_status: reg?.final_status,
    });

    const flow = await db.ApprovalFlow.findOne({
      where: { entity_ref: "member_registrations" },
      include: [{ model: db.ApprovalStep, as: "steps" }],
    });

    const currentStep = flow?.steps?.find((s) => s.approval_step_id === reg?.current_step_id);
    console.log("Current Step:", currentStep ? `${currentStep.step_name} (Order: ${currentStep.step_order})` : "NULL / COMPLETED");

    const billItems = await db.BillItem.findAll({ where: { member_id: member.member_id } });
    console.log(`\nBillItems count: ${billItems.length}`);
    billItems.forEach((b) => {
      console.log(` - [${b.status}] ${b.category_code} | ${b.description} | Rp ${b.amount} (ID: ${b.bill_item_id})`);
    });

    const txs = await db.Transaction.findAll({ where: { member_id: member.member_id } });
    console.log(`\nTransactions count: ${txs.length}`);
    txs.forEach((t) => {
      console.log(` - [${t.status}] ${t.tx_category} | Rp ${t.amount} (ID: ${t.transaction_id}) | payment_type: ${t.payment_type} | proof_of_transfer: ${t.proof_of_transfer}`);
    });

    const pendingRegs = await db.MemberRegistration.findAll({
      where: { member_id: member.member_id },
      include: [
        {
          model: db.Member,
          as: 'member',
          include: [
            {
              model: db.Transaction,
              as: 'transactions',
              where: {
                status: 'PENDING_VERIFICATION',
                payment_type: 'manual_transfer'
              },
              required: false,
            }
          ]
        }
      ]
    });
    console.log("\nPendingRegs from Query:", JSON.stringify(pendingRegs, null, 2));

    const roles = await db.UserRole.findAll();
    console.log("\nAll User Roles in DB:");
    roles.forEach(r => console.log(` - ID: ${r.role_id} | Name: ${r.role_name}`));

    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

checkBills();
