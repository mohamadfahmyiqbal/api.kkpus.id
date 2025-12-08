import { Sequelize } from "sequelize";

const BusinessProfile = (sequelize) => {
  const { DataTypes } = Sequelize;

  const BusinessProfileModel = sequelize.define("business_profiles", {
    profile_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true, // Foreign Key
    },
    business_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    business_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    monthly_revenue: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  return BusinessProfileModel;
};

export default BusinessProfile;