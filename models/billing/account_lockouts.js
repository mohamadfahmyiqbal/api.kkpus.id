// 📁 models/billing/account_lockouts.js

import { Sequelize } from "sequelize";

const AccountLockout = (sequelize) => {
  const { DataTypes } = Sequelize;

  const AccountLockoutModel = sequelize.define("AccountLockout", {
    lockout_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email_or_phone: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    lockout_reason: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lockout_start: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lockout_end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    failed_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  }, {
    tableName: "account_lockouts",
    timestamps: false,
    indexes: [
      { fields: ["email_or_phone"] },
      { fields: ["lockout_end"] },
      { fields: ["is_active"] },
    ],
  });

  return AccountLockoutModel;
};

export default AccountLockout;
