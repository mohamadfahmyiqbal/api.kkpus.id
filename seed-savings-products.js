import db from './models/index.js';
import { v4 as uuidv4 } from 'uuid';

async function seedSavingsProducts() {
  try {
    const products = [
      { product_code: 'SP_POKOK', name: 'Simpanan Pokok', akad_type: 'Wadiah' },
      { product_code: 'SW_WAJIB', name: 'Simpanan Wajib', akad_type: 'Wadiah' },
      { product_code: 'SS_SUKARELA', name: 'Simpanan Sukarela', akad_type: 'Mudharabah' }
    ];

    const productsToInsert = [];

    for (const p of products) {
      const existing = await db.SavingsProduct.findOne({
        where: { product_code: p.product_code }
      });

      if (!existing) {
        productsToInsert.push({
          savings_product_id: uuidv4(),
          product_code: p.product_code,
          name: p.name,
          akad_type: p.akad_type,
          created_at: new Date(Date.now() + productsToInsert.length * 1000)
        });
      }
    }

    if (productsToInsert.length > 0) {
      console.log(`Inserting ${productsToInsert.length} savings products...`);
      await db.SavingsProduct.bulkCreate(productsToInsert);
      console.log('Savings products inserted.');
    } else {
      console.log('Savings products already exist.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Failed seeding savings products:', error);
    process.exit(1);
  }
}

seedSavingsProducts();
