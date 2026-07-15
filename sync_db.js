import db from "./models/index.js";

async function sync() {
  try {
    await db.sequelize.query("ALTER TABLE arisan_participants ADD COLUMN status VARCHAR(255) DEFAULT 'PENDING' NOT NULL;");
    console.log("Added status to arisan_participants");
  } catch (e) {
    console.error("Error adding column (might already exist):", e.message);
  }

  try {
    await db.ArisanPayment.sync({ alter: true });
    console.log("Synced ArisanPayment");
    await db.ArisanDraw.sync({ alter: true });
    console.log("Synced ArisanDraw");
  } catch (e) {
    console.error("Error syncing tables:", e);
  }
  process.exit();
}

sync();
