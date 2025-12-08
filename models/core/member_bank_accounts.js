import { Sequelize } from "sequelize";

const MemberBankAccount = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberBankAccountModel = sequelize.define("member_bank_accounts", {
    member_bank_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    account_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    account_holder_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return MemberBankAccountModel;
};

export default MemberBankAccount;