import { Sequelize } from "sequelize";

const Curriculum = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "curriculums",
    {
      curriculum_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      curriculum_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      curriculum_type: {
        type: DataTypes.ENUM("WAJIB", "REGULER"),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
      tableName: "curriculums",
      timestamps: true,
      underscored: true,
    }
  );
};

export default Curriculum;
