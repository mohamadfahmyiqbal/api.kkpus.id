import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";
import MAnggota from "./MAnggota.js";

const { DataTypes } = Sequelize;
const MAnggotaWallet = pus.define(
  "MAnggotaWallet",
  {
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      references: {
        model: MAnggota,
        key: "nik",
      },
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2), // saldo total
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "anggota_wallet",
    timestamps: true,
  }
);

export default MAnggotaWallet;
