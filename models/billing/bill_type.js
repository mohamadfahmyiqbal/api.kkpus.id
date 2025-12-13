// 📁 models/billing/bill_type.js (Model Baru)

import { Sequelize } from "sequelize";

const BillType = (sequelize) => {
  const { DataTypes } = Sequelize;

  const BillTypeModel = sequelize.define(
    "bill_type",
    {
      bill_type_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      type_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true, // Kode harus unik
      },
      type_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      default_amount: {
        type: DataTypes.DECIMAL(18, 2), // Precision yang cukup
        allowNull: false,
      },
      period_type: {
        type: DataTypes.STRING(50), // ONE_TIME, MONTHLY, ANNUAL
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return BillTypeModel;
};

export default BillType;
