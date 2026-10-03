// models/content/passwordResetToken.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PasswordResetToken = sequelize.define(
    "PasswordResetToken",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      reset_token: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      used_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      member_id: {
        type: DataTypes.UUID, // varchar(36) to match production schema
        allowNull: false,
      },
    },
    {
      tableName: "password_reset_tokens",
      timestamps: true,
      indexes: [
        {
          name: "reset_token_idx",
          fields: ["reset_token"],
        },
        {
          name: "session_id_idx",
          fields: ["session_id"],
        },
        {
          name: "member_id_idx",
          fields: ["member_id"],
        },
        {
          name: "expires_at_idx",
          fields: ["expires_at"],
        },
      ],
    },
  );

  return PasswordResetToken;
};
