import db from "./models/index.js";

const run = async () => {
    try {
        await db.sequelize.query(`
            ALTER TABLE savings_withdrawals 
            MODIFY COLUMN savings_account_id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL;
        `);
        console.log("Modified savings_account_id to be NULLable.");
        
        await db.sequelize.query(`
            ALTER TABLE savings_withdrawals 
            ADD COLUMN member_saving_target_id char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL AFTER savings_account_id;
        `);
        console.log("Added member_saving_target_id column.");
        
        console.log("Migration successful!");
    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        process.exit(0);
    }
};

run();
