import { Sequelize } from "sequelize";

const Approval = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ApprovalModel = sequelize.define(
    "approvals",
    {
      approval_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      approval_step_id: {
        type: DataTypes.BIGINT,
        allowNull: false, // Foreign Key ke approval_steps
      },
      approver_member_id: {
        type: DataTypes.BIGINT,
        allowNull: true, // Foreign Key ke members.member_id (Boleh null jika belum disetujui/diassign)
      },
      decision: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "SKIPPED"), // Menambahkan PENDING dan SKIPPED untuk kelengkapan
        allowNull: false,
        defaultValue: "PENDING",
      },
      decision_datetime: {
        type: DataTypes.DATE,
        allowNull: true, // Null sampai ada keputusan
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true, // Mengaktifkan created_at dan updated_at
    }
  );

  ApprovalModel.associate = (models) => {
    // Approval milik satu Step
    ApprovalModel.belongsTo(models.ApprovalStep, {
      foreignKey: "approval_step_id",
      as: "step",
    });
    // Approval dibuat oleh satu Member (Approver)
    ApprovalModel.belongsTo(models.Member, { // Mengacu pada models/members.js
      foreignKey: "approver_member_id",
      as: "approver",
    });
  };

  return ApprovalModel;
};

export default Approval;