import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('koperasi', 'admin', 'qwerty123!!', {
  host: '202.52.147.193',
  dialect: 'mysql',
  timezone: '+07:00'
});

async function run() {
  try {
    const currentYear = new Date().getFullYear();
    const query = `
      SELECT 
        m.member_id AS id,
        m.full_name AS nama,
        SUM(CASE WHEN YEAR(f.created_at) = :currentYear THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS pokok_ini,
        SUM(CASE WHEN YEAR(f.created_at) = :currentYear THEN COALESCE(f.down_payment, 0) ELSE 0 END) AS dp_ini,
        SUM(CASE WHEN YEAR(f.created_at) = :currentYear THEN COALESCE(f.margin_amount, 0) ELSE 0 END) AS margin_ini,
        
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS pokok_lalu,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear THEN COALESCE(f.down_payment, 0) ELSE 0 END) AS dp_lalu,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear THEN COALESCE(f.margin_amount, 0) ELSE 0 END) AS margin_lalu,
        
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear2 THEN f.required_amount - COALESCE(f.down_payment, 0) ELSE 0 END) AS pokok_lalu2,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear2 THEN COALESCE(f.down_payment, 0) ELSE 0 END) AS dp_lalu2,
        SUM(CASE WHEN YEAR(f.created_at) = :lastYear2 THEN COALESCE(f.margin_amount, 0) ELSE 0 END) AS margin_lalu2
      FROM financing_applications f
      JOIN members m ON f.member_id = m.member_id
      WHERE f.purpose LIKE 'Pinjaman%' AND f.status IN ('APPROVED', 'ACTIVE', 'COMPLETED')
      GROUP BY m.member_id, m.full_name
    `;

    const results = await sequelize.query(query, {
      replacements: {
        currentYear: currentYear,
        lastYear: currentYear - 1,
        lastYear2: currentYear - 2
      },
      type: Sequelize.QueryTypes.SELECT
    });
    console.log("Success! Returned " + results.length + " rows");
  } catch (err) {
    console.error("SQL Error: ", err.message);
  } finally {
    await sequelize.close();
  }
}
run();
