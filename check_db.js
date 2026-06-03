import db from "./models/index.js";

async function check() {
  try {
    const apps = await db.FinancingApplication.findAll({
      order: [['financing_id', 'DESC']],
      limit: 5
    });
    console.log("Recent FinancingApplications by ID:");
    apps.forEach(a => console.log(a.financing_id, a.status, a.current_step_id));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
