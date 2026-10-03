import { Sequelize } from "sequelize";

const Ranking = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "rankings",
    {
      ranking_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      total_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      completed_materials: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rank_position: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "rankings",
      timestamps: true,
      underscored: true,
    }
  );
};

export default Ranking;
