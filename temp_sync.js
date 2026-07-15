import db from "./models/index.js";

async function sync() {
  try {
    await db.SukukIssue.sync({ alter: true });
    console.log("SukukIssue synced successfully.");
  } catch (error) {
    console.error("Error syncing SukukIssue:", error);
  } finally {
    process.exit();
  }
}

sync();
