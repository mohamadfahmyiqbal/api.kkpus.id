// models/financing/financing_terms.js
import { Sequelize } from "sequelize";

const FinancingTerm = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define("financing_terms", {
    term_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    },
    persentase_anggota: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    },
    persentase_reguler: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
  });
};

export default FinancingTerm;