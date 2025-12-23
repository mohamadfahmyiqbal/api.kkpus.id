// src/models/savings/member_savings_accounts.js
export default (sequelize) => {
  const { DataTypes } = sequelize.Sequelize;

  return sequelize.define("member_savings_accounts", {
    savings_account_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: { type: DataTypes.BIGINT, allowNull: false },
    savings_product_id: { type: DataTypes.BIGINT },
    account_no: { type: DataTypes.STRING }, // Sesuai kolom database Anda
    account_type: { type: DataTypes.STRING }, // Sesuai kolom database Anda
    open_date: { type: DataTypes.DATEONLY },
    nominal: { type: DataTypes.DECIMAL(18, 2) },
    current_balance: { type: DataTypes.DECIMAL(18, 2) },
  }, { 
    freezeTableName: true, 
    timestamps: true,
    // Mapping agar Sequelize mencari 'created_at' bukan 'createdAt'
    createdAt: 'created_at', 
    updatedAt: 'updated_at'
  });
};