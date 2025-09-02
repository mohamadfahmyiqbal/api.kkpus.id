import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MInvoices = pus.define(
  "invoices",
  {
    invoice_id: {
      type: DataTypes.BIGINT,
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
    bank_name: {
      type: DataTypes.STRING(100),
    },
    virtual_account: {
      type: DataTypes.STRING(50),
    },
    payment_status: {
      type: DataTypes.ENUM(
        "Menunggu Pembayaran",
        "Sudah Dibayar",
        "Kadaluarsa"
      ),
      defaultValue: "Menunggu Pembayaran",
    },
    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true, // createdAt & updatedAt otomatis
  }
);

export default MInvoices;
