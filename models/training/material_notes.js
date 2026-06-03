import { Sequelize } from "sequelize";

const MaterialNote = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "material_notes",
    {
      note_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      material_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      note_content: {
        type: DataTypes.TEXT,
        allowNull: true,
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
      tableName: "material_notes",
      timestamps: true,
      underscored: true,
    }
  );
};

export default MaterialNote;
