import db from './models/index.js';

(async () => {
  try {
    const results = await db.sequelize.query(
      'SELECT financing_id, category, business_name, business_sector, estimated_yearly_turnover, file_evidence, contract_proof FROM financing_applications ORDER BY created_at DESC LIMIT 1',
      { type: db.Sequelize.QueryTypes.SELECT }
    );
    console.log(JSON.stringify(results, null, 2));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    process.exit(0);
  }
})();
