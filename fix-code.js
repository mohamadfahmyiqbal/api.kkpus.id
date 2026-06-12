import db from "./models/index.js";

async function fixCode() {
  await db.SavingsProduct.update({ product_code: 'SW_POKOK' }, { where: { product_code: 'SP_POKOK' } });
  console.log("Renamed SP_POKOK to SW_POKOK");
  process.exit();
}
fixCode();
