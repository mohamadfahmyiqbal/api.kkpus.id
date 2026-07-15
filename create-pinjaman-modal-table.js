import pus from "./config/pus.js";
import { DataTypes } from "sequelize";

export const PinjamanModal = pus.define('pinjaman_modal_transactions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tanggal: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  no_transaksi: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  pic: {
    type: DataTypes.STRING,
    allowNull: false
  },
  keperluan: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  jenis: {
    type: DataTypes.ENUM('DEBET', 'KREDIT'),
    allowNull: false
  },
  jumlah: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  }
}, {
  tableName: 'pinjaman_modal_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

async function run() {
  try {
    await PinjamanModal.sync({ alter: true });
    console.log("Table created successfully");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

run();
