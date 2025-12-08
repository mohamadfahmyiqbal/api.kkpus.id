import { Sequelize } from "sequelize";

const MemberSavingsAccount = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberSavingsAccountModel = sequelize.define("member_savings_accounts", {
    account_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    account_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    current_balance: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    open_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.ENUM('ACTIVE', 'CLOSED', 'FROZEN'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return MemberSavingsAccountModel;
};

export default MemberSavingsAccount;