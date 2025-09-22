import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MInvoices = pus.define(
  "invoices",
  {
    invoice_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    recipient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recipient_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    invoice_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(100),
    },
    jenis_trans: {
      type: DataTypes.STRING(255),
    },
    payment_status: {
      type: DataTypes.STRING(255),
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
    },
    type_trans: {
      type: DataTypes.STRING(50), // <- perbaikan
    },
    order_id: {
      type: DataTypes.STRING(100), // <- perbaikan
    },
    payment_desc: {
      type: DataTypes.STRING(255), // <- perbaikan
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default MInvoices;
