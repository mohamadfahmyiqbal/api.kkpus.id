import db from './models/index.js';

async function run() {
  try {
    await db.sequelize.query('ALTER TABLE financing_applications MODIFY financing_id BIGINT NOT NULL');
    await db.sequelize.query('ALTER TABLE financing_applications MODIFY financing_id VARCHAR(36) NOT NULL');
    console.log('Successfully altered financing_id to UUID');
  } catch (error) {
    console.error('Error altering table:', error);
  }
  process.exit(0);
}

run();
