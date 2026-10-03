// models/associations/billingAssociations.js
export default function defineBillingAssociations(db) {
  // Member & Bill
  db.Member.hasMany(db.Bill, { foreignKey: "member_id", as: "bills" });
  db.Bill.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Bill & Bill Items
  db.Bill.hasMany(db.BillItem, { foreignKey: "bill_id", as: "items" });
  db.BillItem.belongsTo(db.Bill, { foreignKey: "bill_id", as: "bill" });

  db.BillItem.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Bill & BillType
  db.BillItem.belongsTo(db.BillType, { foreignKey: "bill_type_id", as: "type" });
  db.BillType.hasMany(db.BillItem, { foreignKey: "bill_type_id", as: "items" });

  db.Bill.belongsTo(db.BillType, { foreignKey: "bill_type_id", as: "billType" });
  db.BillType.hasMany(db.Bill, { foreignKey: "bill_type_id", as: "bills" });

  // Transactions (General & Core)
  db.Member.hasMany(db.Transaction, { foreignKey: "member_id", as: "transactions" });
  db.Transaction.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  db.Member.hasMany(db.GeneralTransaction, { foreignKey: "member_id", as: "general_transactions" });
  db.GeneralTransaction.belongsTo(db.Member, { foreignKey: "member_id", as: "member" });

  // Account & Transaction (Mutations)
  db.Account.hasMany(db.Transaction, { foreignKey: "member_id", as: "mutations" });
  db.Transaction.belongsTo(db.Account, { foreignKey: "member_id", as: "account" });

  // Bill & Transaction (Payments)
  db.Bill.hasMany(db.Transaction, { foreignKey: "bill_id", as: "payments" });
  db.Transaction.belongsTo(db.Bill, { foreignKey: "bill_id", as: "bill" });
}
