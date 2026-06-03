// models/content/forgotPasswordSession.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const ForgotPasswordSession = sequelize.define(
    "ForgotPasswordSession",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email_hp: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      session_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      otp_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      member_id: {
        type: DataTypes.STRING(36), // varchar(36) to match production schema
        allowNull: false,
      },
    },
    {
      tableName: "forgot_password_sessions",
      timestamps: true,
      indexes: [
        {
          name: "session_id_idx",
          fields: ["session_id"],
        },
        {
          name: "email_hp_idx",
          fields: ["email_hp"],
        },
        {
          name: "expires_at_idx",
          fields: ["expires_at"],
        },
        {
          name: "member_id_idx",
          fields: ["member_id"],
        },
      ],
    },
  );

  return ForgotPasswordSession;
};
