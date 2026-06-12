import dotenv from "dotenv";
dotenv.config();
import db from "./models/index.js";

const data = ["Property", "Kendaraan", "Elektronik"];

async function seed() {
  try {
    // Sync table
    await db.FinancingCategory.sync({ alter: true });
    console.log("Database schema updated with alter: true");

    // Kosongkan tabel (optional, tapi aman untuk seed data statis)
    await db.FinancingCategory.destroy({ where: {}, truncate: true });
    console.log("Table truncated");

    // Masukkan data baru
    const records = data.map((item) => ({
      category_name: item,
      is_active: true,
    }));

    await db.FinancingCategory.bulkCreate(records);
    console.log("Successfully seeded", records.length, "financing categories");
    
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed:", err);
    process.exit(1);
  }
}

seed();
