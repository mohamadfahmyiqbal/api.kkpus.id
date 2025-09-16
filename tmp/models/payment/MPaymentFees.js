import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MPaymentFees = pus.define(
  "payment_fees",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fee_type: {
      type: DataTypes.ENUM("fixed", "percentage"),
      allowNull: false,
      defaultValue: "fixed",
    },
    fee_value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default MPaymentFees;
