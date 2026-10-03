import { Sequelize } from "sequelize";

const LandingAbout = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "landing_about",
    {
      about_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      vision: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mission: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "landing_about",
      timestamps: true,
      underscored: true,
    }
  );
};

export default LandingAbout;
