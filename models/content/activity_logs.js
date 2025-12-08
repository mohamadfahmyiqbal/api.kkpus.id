import { Sequelize } from "sequelize";

const ActivityLog = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ActivityLogModel = sequelize.define("activity_logs", {
    log_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key Pelaku aktivitas
    },
    activity_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return ActivityLogModel;
};

export default ActivityLog;