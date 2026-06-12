// 📁 src/models/billing/bill_items.js
import { Sequelize } from "sequelize";

const BillItem = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "bill_items",
    {
      bill_item_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      bill_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      bill_type_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      category_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('UNPAID', 'PAID', 'CANCELLED', 'OVERDUE'),
        defaultValue: 'UNPAID',
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      underscored: true, // WAJIB: Mengubah createdAt -> created_at & updatedAt -> updated_at
    }
  );
};

export default BillItem;