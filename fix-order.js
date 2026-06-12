import db from './models/index.js';

async function fixSavingsProductOrder() {
  try {
    const products = await db.SavingsProduct.findAll();
    
    // Sort logic to determine the order
    const orderMap = {
      'SP_POKOK': 1,
      'SW_WAJIB': 2,
      'SS_SUKARELA': 3
    };

    products.sort((a, b) => {
      const orderA = orderMap[a.product_code] || 99;
      const orderB = orderMap[b.product_code] || 99;
      return orderA - orderB;
    });

    let baseTime = new Date().getTime();

    // Update created_at in the desired order
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      p.created_at = new Date(baseTime + i * 1000);
      await p.save();
      console.log(`Updated ${p.product_code} with new created_at: ${p.created_at}`);
    }

    console.log('Successfully fixed database order!');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing order:', err);
    process.exit(1);
  }
}

fixSavingsProductOrder();
