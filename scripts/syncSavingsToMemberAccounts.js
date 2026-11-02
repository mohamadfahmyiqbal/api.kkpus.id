import db from "../models/index.js";

export const syncSavingsToMemberAccounts = async () => {
  console.log("Starting sync from savings table to member_savings_accounts...");

  const products = await db.SavingsProduct.findAll();
  const productMap = {};
  products.forEach(p => {
    const code = p.product_code.toUpperCase();
    if (code.includes("POKOK")) productMap["POKOK"] = p;
    else if (code.includes("WAJIB")) productMap["WAJIB"] = p;
    else if (code.includes("SUKARELA")) productMap["SUKARELA"] = p;
  });

  const [savingsSummary] = await db.sequelize.query(`
    SELECT s.member_id, s.savings_type, SUM(s.amount) as total_amount, MIN(s.transaction_date) as min_date, m.member_no, m.full_name
    FROM savings s
    LEFT JOIN members m ON s.member_id = m.member_id
    WHERE s.status IN ('COMPLETED', 'APPROVED')
    GROUP BY s.member_id, s.savings_type
  `);

  console.log(`Found ${savingsSummary.length} member-saving groups to sync.`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of savingsSummary) {
    const type = (item.savings_type || "").toUpperCase();
    const product = productMap[type];

    if (!product) {
      console.warn(`No product found for savings type: ${type}`);
      continue;
    }

    const totalAmount = parseFloat(item.total_amount) || 0;
    const memberNo = item.member_no || item.member_id.substring(0, 8);
    const accountNo = `SAV-${product.product_code}-${memberNo}`;
    const openDate = item.min_date || new Date();

    const [account, created] = await db.MemberSavingsAccount.findOrCreate({
      where: {
        member_id: item.member_id,
        savings_product_id: product.savings_product_id,
      },
      defaults: {
        account_no: accountNo,
        account_type: product.name,
        open_date: openDate,
        current_balance: totalAmount,
      },
    });

    if (created) {
      createdCount++;
    } else {
      await account.update({
        current_balance: totalAmount,
        account_no: account.account_no && account.account_no !== "-" ? account.account_no : accountNo,
      });
      updatedCount++;
    }
  }

  console.log(`Sync completed! Created: ${createdCount}, Updated: ${updatedCount}`);
  return { createdCount, updatedCount };
};

// If run directly
if (process.argv[1]?.endsWith("syncSavingsToMemberAccounts.js")) {
  syncSavingsToMemberAccounts()
    .then((res) => {
      console.log("Done:", res);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Sync error:", err);
      process.exit(1);
    });
}
