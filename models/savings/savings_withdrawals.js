import { Sequelize } from "sequelize";

const SavingsWithdrawal = (sequelize) => {
  const { DataTypes } = Sequelize;

  const SavingsWithdrawalModel = sequelize.define("savings_withdrawals", {
    withdrawal_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    savings_account_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    withdrawal_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      allowNull: false,
      defaultValue: "PENDING",
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return SavingsWithdrawalModel;
};

export default SavingsWithdrawal;