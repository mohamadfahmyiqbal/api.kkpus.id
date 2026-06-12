import db from "./models/index.js";

async function test() {
  try {
    const products = await db.SavingsProduct.findAll();
    console.log("Products:", JSON.stringify(products, null, 2));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit();
  }
}

test();
