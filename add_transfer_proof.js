import db from "./models/index.js";

const run = async () => {
  try {
    await db.sequelize.query('ALTER TABLE savings_withdrawals ADD COLUMN transfer_proof VARCHAR(255)');
    console.log("Column transfer_proof added to savings_withdrawals");
  } catch (error) {
    console.log("Error savings_withdrawals:", error.message);
  }

  try {
    await db.sequelize.query('ALTER TABLE arisan_draws ADD COLUMN transfer_proof VARCHAR(255)');
    console.log("Column transfer_proof added to arisan_draws");
  } catch (error) {
    console.log("Error arisan_draws:", error.message);
  }

  process.exit(0);
};

run();
