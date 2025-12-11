import { Sequelize } from "sequelize";

const ApprovalFlow = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ApprovalFlowModel = sequelize.define(
    "approval_flows",
    {
      approval_flow_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      flow_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      entity_ref: {
        type: DataTypes.STRING(100), // Contoh: 'member_registration', 'loan_application'
        allowNull: false,
      },
      entity_id: {
        type: DataTypes.BIGINT, // ID dari entitas yang disetujui, contoh: registration_id
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true, // Mengaktifkan created_at dan updated_at
    }
  );

  ApprovalFlowModel.associate = (models) => {
    // Satu Flow memiliki banyak Steps
    ApprovalFlowModel.hasMany(models.ApprovalStep, {
      foreignKey: "approval_flow_id",
      as: "steps",
    });
    // Jika Anda memiliki model untuk entitas yang dirujuk (misal MemberRegistration)
    // ApprovalFlowModel.belongsTo(models.MemberRegistration, {
    //   foreignKey: "entity_id",
    //   constraints: false, // Nonaktifkan foreign key constraint karena entity_ref bisa berbeda
    // });
  };

  return ApprovalFlowModel;
};

export default ApprovalFlow;