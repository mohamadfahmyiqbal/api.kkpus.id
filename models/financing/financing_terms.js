// models/financing/financing_terms.js
import { Sequelize } from "sequelize";

const FinancingTerm = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define("financing_terms", {
    term_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    label: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    value_months: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });
};

export default FinancingTerm;