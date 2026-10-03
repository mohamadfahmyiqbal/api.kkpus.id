import { Sequelize } from "sequelize";

const SavingTarget = (sequelize) => {
  const { DataTypes } = Sequelize;

  const SavingTargetModel = sequelize.define("saving_targets", {
    saving_target_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    target_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    target_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    term_months: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    min_monthly_deposit: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    akad_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return SavingTargetModel;
};

export default SavingTarget;