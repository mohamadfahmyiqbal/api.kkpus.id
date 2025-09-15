import { Sequelize } from "sequelize";
import pus from "../../config/pus.js";

const { DataTypes } = Sequelize;

const MPaymentRules = pus.define(
  "payment_rules",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    jenis_payment: {
      type: DataTypes.STRING,
    },
    tipe_anggota: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    ammount: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

export default MPaymentRules;
