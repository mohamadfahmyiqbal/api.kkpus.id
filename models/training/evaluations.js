import { Sequelize } from "sequelize";

const Evaluation = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "evaluations",
    {
      evaluation_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      material_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      passed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      answers: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      evaluated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "evaluations",
      timestamps: true,
      underscored: true,
    }
  );
};

export default Evaluation;
