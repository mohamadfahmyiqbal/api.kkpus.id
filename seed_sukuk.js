import db from "./models/index.js";

async function seed() {
  try {
    const { SukukIssue } = db;
    
    // Create Dummy Sukuk 1
    await SukukIssue.create({
      issue_name: "Sukuk Ritel SR018",
      total_amount: 50000000000, // 50 Miliar
      start_date: new Date("2025-01-01"),
      end_date: new Date("2028-01-01"),
      status: "OPEN",
      issuer: "Pemerintah RI / Koperasi",
      type: "Sukuk Ritel",
      coupon: "6.5%",
      min_investment: 1000000, // 1 Juta
      price: 100.0
    });

    // Create Dummy Sukuk 2
    await SukukIssue.create({
      issue_name: "Sukuk Mudharabah Koperasi",
      total_amount: 10000000000, // 10 Miliar
      start_date: new Date("2025-06-01"),
      end_date: new Date("2026-06-01"),
      status: "OPEN",
      issuer: "Koperasi Syariah XYZ",
      type: "Sukuk Mudharabah",
      coupon: "8.0%",
      min_investment: 5000000, // 5 Juta
      price: 100.0
    });

    console.log("Seeding Sukuk berhasil!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding:", error);
    process.exit(1);
  }
}

seed();
