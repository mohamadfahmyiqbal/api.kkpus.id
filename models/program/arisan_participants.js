import { Sequelize } from "sequelize";

const ArisanParticipant = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ArisanParticipantModel = sequelize.define(
    "arisan_participants",
    {
      arisan_participant_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      arisan_batch_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      participant_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      saldo_putang: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      cicilan_target: {
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

  return ArisanParticipantModel;
};

export default ArisanParticipant;
