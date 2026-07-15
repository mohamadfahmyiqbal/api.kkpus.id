import { DataTypes } from "sequelize";
import pus from "../../config/pus.js";

const PinjamanAktivaTetap = pus.define('pinjaman_aktiva_tetap_transactions', {
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
  tableName: 'pinjaman_aktiva_tetap_transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default PinjamanAktivaTetap;
