// 📁 models/billing/bill_items.js

import { Sequelize } from "sequelize";

const BillItem = (sequelize) => {
  const { DataTypes } = Sequelize;

  const BillItemModel = sequelize.define(
    "bill_items",
    {
      bill_item_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // Kunci asing ke tabel 'bills'
      bill_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // Ini tidak wajib, tapi direkomendasikan untuk integritas referensial
        // references: {
        //   model: 'bills', 
        //   key: 'bill_id',
        // },
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE',
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2), // Jumlah per item
        allowNull: false,
      },
      // Kolom 'qty' dan 'unit_price' mungkin juga diperlukan
      // qty: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   defaultValue: 1,
      // },
      // unit_price: {
      //   type: DataTypes.DECIMAL(15, 2),
      //   allowNull: false,
      // },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return BillItemModel;
};

export default BillItem;