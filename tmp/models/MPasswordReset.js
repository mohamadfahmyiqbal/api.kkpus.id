// models/MPasswordReset.js
import { DataTypes } from "sequelize";
import pus from "../config/pus.js";

const MPasswordReset = pus.define(
  "password_resets",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "active",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "password_resets",
    timestamps: false,
    freezeTableName: true,
  }
);

export default MPasswordReset;
