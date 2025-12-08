import { Sequelize } from "sequelize";

const FinancingApplication = (sequelize) => {
  const { DataTypes } = Sequelize;

  const FinancingApplicationModel = sequelize.define("financing_applications", {
    application_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    amount_requested: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'DISBURSED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    application_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return FinancingApplicationModel;
};

export default FinancingApplication;