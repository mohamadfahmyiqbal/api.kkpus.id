import db from "./models/index.js";

async function run() {
  try {
    console.log("Checking for transfer_proof column in arisan_draws...");
    const queryInterface = db.sequelize.getQueryInterface();
    const tableDesc = await queryInterface.describeTable("arisan_draws");

    if (!tableDesc.transfer_proof) {
      await queryInterface.addColumn("arisan_draws", "transfer_proof", {
        type: db.Sequelize.DataTypes.STRING(255),
        allowNull: true,
      });
      console.log("Successfully added transfer_proof column to arisan_draws.");
    } else {
      console.log("transfer_proof column already exists.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error adding column:", error);
    process.exit(1);
  }
}

run();
