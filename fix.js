import db from './models/index.js';
db.sequelize.query("UPDATE sukuk_orders SET status = 'PAID' WHERE order_id = 9").then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
