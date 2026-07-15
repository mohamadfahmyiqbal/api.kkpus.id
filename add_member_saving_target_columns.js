import db from "./models/index.js";

async function run() {
  try {
    console.log("Checking for columns in member_saving_targets...");
    const queryInterface = db.sequelize.getQueryInterface();
    const tableDesc = await queryInterface.describeTable("member_saving_targets");

    if (!tableDesc.target_amount) {
      await queryInterface.addColumn("member_saving_targets", "target_amount", {
        type: db.Sequelize.DataTypes.DECIMAL(18, 2),
        allowNull: true,
      });
      console.log("Successfully added target_amount column.");
    }
    if (!tableDesc.term_months) {
      await queryInterface.addColumn("member_saving_targets", "term_months", {
        type: db.Sequelize.DataTypes.INTEGER,
        allowNull: true,
      });
      console.log("Successfully added term_months column.");
    }
    if (!tableDesc.monthly_deposit) {
      await queryInterface.addColumn("member_saving_targets", "monthly_deposit", {
        type: db.Sequelize.DataTypes.DECIMAL(18, 2),
        allowNull: true,
      });
      console.log("Successfully added monthly_deposit column.");
    }
    
    process.exit(0);
  } catch (error) {
    console.error("Error adding columns:", error);
    process.exit(1);
  }
}

run();
