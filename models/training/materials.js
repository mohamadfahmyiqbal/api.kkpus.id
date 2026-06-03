import { Sequelize } from "sequelize";

const Material = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "materials",
    {
      material_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      curriculum_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      material_title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      material_type: {
        type: DataTypes.ENUM("AUDIO", "VIDEO", "DOCUMENT"),
        allowNull: false,
      },
      content_url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      order_index: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_unlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "materials",
      timestamps: true,
      underscored: true,
    }
  );
};

export default Material;
