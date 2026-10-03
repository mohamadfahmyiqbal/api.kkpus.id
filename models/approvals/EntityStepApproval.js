import { Sequelize } from "sequelize";

const EntityStepApproval = (sequelize) => {
  const { DataTypes } = Sequelize;

  const Model = sequelize.define("EntityStepApproval", {
    entity_step_approval_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    entity_ref: {
      type: DataTypes.STRING(50), // 'financing_application', 'member_registration', dll
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    approval_step_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    is_approved: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    }
  }, {
    tableName: "entity_step_approvals",
    underscored: true,
    timestamps: false,
  });

  Model.associate = (models) => {
    Model.belongsTo(models.ApprovalStep, { foreignKey: 'approval_step_id', as: 'step' });
  };

  return Model;
};

export default EntityStepApproval;