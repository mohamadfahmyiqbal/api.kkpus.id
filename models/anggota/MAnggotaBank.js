import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MAnggotaBank = pus.define(
  "anggota_bank",
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    bank: {
      type: DataTypes.STRING,
    },
    no_rekening: {
      type: DataTypes.STRING,
    },
    nama_nasabah: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    id: false,
  }
);

export default MAnggotaBank;
