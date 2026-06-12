import db from './models/index.js';

async function seedBillTypes() {
  try {
    const types = [
      { type_code: 'SW_POKOK', tx_type: 'SETORAN', category_map: 'SIMPANAN_POKOK', type_name: 'Simpanan Pokok', default_amount: 100000, period_type: 'ONETIME' },
      { type_code: 'SW_WAJIB', tx_type: 'SETORAN', category_map: 'SIMPANAN_WAJIB', type_name: 'Simpanan Wajib', default_amount: 50000, period_type: 'MONTHLY' },
      { type_code: 'SS_SUKARELA', tx_type: 'SETORAN', category_map: 'SIMPANAN_SUKARELA', type_name: 'Simpanan Sukarela', default_amount: 0, period_type: 'FLEXIBLE' },
      { bill_type_id: 7, type_code: 'TRANSACTION_DOWN_PAYMENT', tx_type: 'PEMBAYARAN', category_map: 'FINANCING', type_name: 'Down Payment', default_amount: 0, period_type: 'ONETIME' },
      { bill_type_id: 8, type_code: 'TRANSACTION_INSTALLMENT', tx_type: 'PEMBAYARAN', category_map: 'FINANCING', type_name: 'Cicilan Pembiayaan', default_amount: 0, period_type: 'MONTHLY' },
      { type_code: 'TABUNGAN_DEPOSIT', tx_type: 'SETORAN', category_map: 'SAVINGS_TARGET', type_name: 'Setoran Tabungan', default_amount: 0, period_type: 'MONTHLY' }
    ];
    await db.BillType.bulkCreate(types, { ignoreDuplicates: true });
    console.log('BillTypes seeded!');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
seedBillTypes();
