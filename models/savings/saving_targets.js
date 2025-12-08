import { Sequelize } from "sequelize";

const SavingTarget = (sequelize) => {
  const { DataTypes } = Sequelize;

  const SavingTargetModel = sequelize.define("saving_targets", {
    target_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    target_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    target_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    current_saved: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return SavingTargetModel;
};

export default SavingTarget;