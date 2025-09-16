// models/MNeracaPinjaman.js
import { DataTypes } from "sequelize";
import pus from "../../config/pus.js";

const MNeracaPinjaman = pus.define(
  "MNeracaPinjaman",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    periode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    debit_kas: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    credit_kas: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    total_kas: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    debit_piutang: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    credit_piutang: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    total_piutang: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    debit_hibah: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    credit_hibah: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    total_hibah: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    debit_beban: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    credit_beban: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    total_beban: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
  },
  {
    tableName: "neraca_pinjaman",
    timestamps: true,
  }
);

export default MNeracaPinjaman;
