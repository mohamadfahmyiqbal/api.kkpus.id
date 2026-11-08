// 📁 models/billing/login_attempts.js

import { Sequelize } from "sequelize";

const LoginAttempt = (sequelize) => {
  const { DataTypes } = Sequelize;

  const LoginAttemptModel = sequelize.define("LoginAttempt", {
    attempt_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email_or_phone: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "members",
        key: "member_id",
      },
    },
    failure_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "login_attempts",
    timestamps: false,
    indexes: [
      { fields: ["email_or_phone"] },
      { fields: ["ip_address"] },
      { fields: ["created_at"] },
      { fields: ["success"] },
      { fields: ["member_id"] },
    ],
  });

  return LoginAttemptModel;
};

export default LoginAttempt;
