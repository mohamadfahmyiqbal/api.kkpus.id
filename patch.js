import db from './models/index.js';

async function run() {
  try {
    const issues = await db.SukukIssue.findAll({ raw: true });
    console.log("Issues:", issues);
    const orders = await db.SukukOrder.findAll({ raw: true });
    console.log("Orders:", orders);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
