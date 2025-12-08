import { Sequelize } from "sequelize";

const Account = (sequelize) => {
  const { DataTypes } = Sequelize;

  const AccountModel = sequelize.define("accounts", {
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
    account_type: {
      type: DataTypes.ENUM('SAVINGS', 'LOAN', 'FINANCING'),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return AccountModel;
};

export default Account;