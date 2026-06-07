import db from './models/index.js';

async function run() {
  try {
    await db.sequelize.authenticate();
    console.log("Connected to db. Altering tables...");

    // This will recreate the tables with the new schema
    await db.SukukIssue.sync({ force: true });
    await db.SukukOrder.sync({ force: true });
    
    // Check if we already have some dummy data
    const count = await db.SukukIssue.count();
    if (count === 0) {
      console.log("Inserting dummy Sukuk Issues...");
      await db.SukukIssue.bulkCreate([
        {
          issue_name: "Sukuk Ritel SR016",
          total_amount: 10000000000.00,
          start_date: "2026-01-01",
          end_date: "2027-03-15",
          status: "OPEN",
          issuer: "Pemerintah RI",
          type: "Sukuk Ritel",
          coupon: "6.50%",
          min_investment: 1000000.00,
          price: 102.50
        },
        {
          issue_name: "Sukuk Ritel SR015",
          total_amount: 5000000000.00,
          start_date: "2025-01-01",
          end_date: "2026-09-15",
          status: "OPEN",
          issuer: "Pemerintah RI",
          type: "Sukuk Ritel",
          coupon: "6.25%",
          min_investment: 1000000.00,
          price: 101.80
        },
        {
          issue_name: "Sukuk Korporasi ABC",
          total_amount: 20000000000.00,
          start_date: "2026-02-01",
          end_date: "2028-06-30",
          status: "OPEN",
          issuer: "PT ABC Tbk",
          type: "Sukuk Korporasi",
          coupon: "7.00%",
          min_investment: 5000000.00,
          price: 103.20
        }
      ]);
      console.log("Dummy Sukuk Issues inserted.");
    } else {
      console.log("Sukuk Issues already seeded.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error running seeder:", error);
    process.exit(1);
  }
}

run();
