import { Sequelize } from "sequelize";

const SukukIssue = (sequelize) => {
  const { DataTypes } = Sequelize;

  const SukukIssueModel = sequelize.define("sukuk_issues", {
    issue_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    issue_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('OPEN', 'CLOSED', 'FULLY_PAID'),
      allowNull: false,
      defaultValue: 'OPEN',
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return SukukIssueModel;
};

export default SukukIssue;