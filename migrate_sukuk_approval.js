import sequelize from './config/pus.js';

try {
  await sequelize.query(
    'ALTER TABLE sukuk_orders ' +
    'ADD COLUMN is_approved_pengawas TINYINT(1) NOT NULL DEFAULT 0, ' +
    'ADD COLUMN is_approved_ketua TINYINT(1) NOT NULL DEFAULT 0, ' +
    'ADD COLUMN is_approved_bendahara TINYINT(1) NOT NULL DEFAULT 0, ' +
    'ADD COLUMN rejected_reason TEXT NULL'
  );
  console.log('Migration done');
} catch (e) {
  if (e.original?.code === 'ER_DUP_FIELDNAME') {
    console.log('Columns already exist, skipping');
  } else {
    console.error(e.message);
  }
} finally {
  await sequelize.close();
}
