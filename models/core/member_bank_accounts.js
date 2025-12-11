// models/member_bank_accounts.js (KOREKSI NAMA KOLOM)
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
    // 🚨 KOREKSI: Diganti dari 'account_number'
    bank_account_no: { 
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    // 🚨 KOREKSI: Diganti dari 'account_holder_name'
    account_holder: { 
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  MemberBankAccountModel.associate = (models) => {
      MemberBankAccountModel.belongsTo(models.Member, {
          foreignKey: "member_id",
          as: "member",
      });
  };

  return MemberBankAccountModel;
};

export default MemberBankAccount;