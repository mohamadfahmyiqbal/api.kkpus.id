import { Sequelize } from "sequelize";

const LandingContact = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "landing_contact",
    {
      contact_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      facebook_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      instagram_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      linkedin_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "landing_contact",
      timestamps: true,
      underscored: true,
    }
  );
};

export default LandingContact;
