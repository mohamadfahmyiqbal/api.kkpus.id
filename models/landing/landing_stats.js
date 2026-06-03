import { Sequelize } from "sequelize";

const LandingStats = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "landing_stats",
    {
      stats_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      active_members: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      financed_businesses: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      satisfaction_rate: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      cities: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "landing_stats",
      timestamps: true,
      underscored: true,
    }
  );
};

export default LandingStats;
