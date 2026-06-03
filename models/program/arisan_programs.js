import { Sequelize } from "sequelize";

const ArisanProgram = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ArisanProgramModel = sequelize.define(
    "arisan_programs",
    {
      arisan_program_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      program_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING(255),
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
      monthly_contribution: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  );

  return ArisanProgramModel;
};

export default ArisanProgram;
