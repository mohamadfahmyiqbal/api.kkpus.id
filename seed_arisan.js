import db from "./models/index.js";

async function seed() {
  const { ArisanProgram, ArisanBatch } = db;
  
  const program = await ArisanProgram.create({
    program_name: "Arisan Haji/Umroh Skema 1",
    category: "Arisan Haji/Umroh",
    target_amount: 50400000,
    term_months: 36,
    monthly_contribution: 1400000
  });

  await ArisanBatch.create({
    arisan_program_id: program.arisan_program_id,
    batch_name: "Batch 1",
    period_start_month: 1,
    period_start_year: 2025,
    participants_quota: 6,
    status: 'ACTIVE',
    monthly_installment: 1400000
  });

  await ArisanBatch.create({
    arisan_program_id: program.arisan_program_id,
    batch_name: "Batch 2",
    period_start_month: 1,
    period_start_year: 2025,
    participants_quota: 30,
    status: 'OPEN',
    monthly_installment: 1400000
  });

  console.log("Seeding complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
