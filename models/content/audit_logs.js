// 📁 models/content/audit_logs.js (AUDIT LOG - FIXED FOR ISO 27001:2022)

import { Sequelize } from "sequelize";

const AuditLog = (sequelize) => {
  const { DataTypes } = Sequelize;

  const AuditLogModel = sequelize.define("AuditLog", {
    audit_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: "WORM-compliant unique audit event identifier",
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: "Actor who performed the action",
    },
    actor_role: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Role of the actor (KETUA, BENDHARA, PENGAWAS)",
    },
    action_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "Action performed (e.g., CREATE_MEMBER, UPDATE_SAVINGS)",
    },
    entity_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Entity affected (MEMBER, SAVINGS, LOAN)",
    },
    entity_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Entity identifier",
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Additional context",
    },
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
      comment: "Client IP address",
    },
    user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "User-Agent string",
    },
    session_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Session identifier",
    },
    success: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: "audit_logs",
    freezeTableName: true,
    timestamps: false,
    indexes: [
      { fields: ["created_at"] },
      { fields: ["user_id"] },
      { fields: ["entity_type", "entity_id"] },
    ],
  });

  return AuditLogModel;
};

export default AuditLog;
