// models/member_emergency_contacts.js (KONFIRMASI)
import { Sequelize } from "sequelize";

const MemberEmergencyContact = (sequelize) => {
  const { DataTypes } = Sequelize;

  const MemberEmergencyContactModel = sequelize.define("member_emergency_contacts", {
    emergency_contact_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key
    },
    contact_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    relation: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, { 
    freezeTableName: true, 
    timestamps: true,
  });

  MemberEmergencyContactModel.associate = (models) => {
    MemberEmergencyContactModel.belongsTo(models.Member, {
        foreignKey: "member_id",
        as: "member",
    });
  };

  return MemberEmergencyContactModel;
};

export default MemberEmergencyContact;