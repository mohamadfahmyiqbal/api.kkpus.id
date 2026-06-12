import db from "../models/index.js";

/**
 * processLedgerRecording
 * Fungsi tunggal untuk mencatat pembukuan saldo setelah pembayaran berhasil.
 * Dipanggil dari Webhook Midtrans DAN Fail-safe sync di getInvoiceDetail.
 */
export const processLedgerRecording = async (localTx, dbTransaction) => {
  const { BillItem, BillType, MemberSavingsAccount, Account, SavingsProduct } = db;

  const targetBillId = localTx.bill_id;
  if (!targetBillId) return;

  const items = await BillItem.findAll({
    where: { bill_id: targetBillId },
    include: [{ model: BillType, as: "type" }],
    transaction: dbTransaction
  });

  let totalItemAmount = 0;

  for (const item of items) {
    const itemAmount = parseFloat(item.amount);
    const billType = item.type;
    if (!billType) continue;

    totalItemAmount += itemAmount;

    // 1. Cari SavingsProduct yang sesuai berdasarkan product_code = billType.type_code
    const savingsProduct = await SavingsProduct.findOne({
      where: { product_code: billType.type_code },
      transaction: dbTransaction
    });

    // 2. Jika ini adalah produk simpanan (terdaftar di SavingsProduct), update saldo tabungan
    if (savingsProduct) {
      const savingsProductId = savingsProduct.savings_product_id;
      const productName = savingsProduct.name;

      console.log(`[Ledger] Recording savings balance for ${productName} (Amount: ${itemAmount})`);

      const savShortId = localTx.member_id.toString().substring(0, 8);
      const [savAcc] = await MemberSavingsAccount.findOrCreate({
        where: { member_id: localTx.member_id, savings_product_id: savingsProductId },
        defaults: {
          account_no: `SAV-${billType.type_code}-${savShortId}`,
          account_type: productName,
          open_date: new Date(),
          current_balance: 0
        },
        transaction: dbTransaction
      });

      await savAcc.increment("current_balance", { by: itemAmount, transaction: dbTransaction });
    }

    // 3. Update/create Ledger Account (Accounting View)
    const shortId = localTx.member_id.toString().substring(0, 8);
    const [typeAccount] = await Account.findOrCreate({
      where: { member_id: localTx.member_id, account_type: billType.type_code },
      defaults: {
        account_no: `ACC-${billType.type_code}-${shortId}`,
        current_balance: 0,
        open_date: new Date(),
      },
      transaction: dbTransaction
    });
    await typeAccount.increment("current_balance", { by: itemAmount, transaction: dbTransaction });

    // 4. Update Tabungan Balance if this is a Tabungan deposit
    if (item.category_code && item.category_code.startsWith('TAB_DEP_')) {
      const tabunganId = item.category_code.replace('TAB_DEP_', '');
      const { MemberSavingTarget } = db;
      const target = await MemberSavingTarget.findByPk(tabunganId, { transaction: dbTransaction });
      if (target) {
        await target.increment('current_balance', { by: itemAmount, transaction: dbTransaction });
        console.log(`[Ledger] Incremented MemberSavingTarget ${tabunganId} by ${itemAmount}`);
      }
    }
  }

  // 4. Update Total Saldo Global (SAVINGS)
  // Perbaikan: Gunakan totalItemAmount (tagihan murni) bukan grossAmount (yang bisa mengandung biaya admin midtrans)
  const mainShortId = localTx.member_id.toString().substring(0, 8);
  const [mainAccount] = await Account.findOrCreate({
    where: { member_id: localTx.member_id, account_type: "SAVINGS" },
    defaults: {
      account_no: `ACC-TOTAL-${mainShortId}`,
      current_balance: 0,
      open_date: new Date(),
    },
    transaction: dbTransaction
  });
  await mainAccount.increment("current_balance", { by: totalItemAmount, transaction: dbTransaction });
  
  // Tandai transaksi sudah diproses ledgernya
  await localTx.update({ is_ledger_recorded: true }, { transaction: dbTransaction });
};
