import { Sequelize } from "sequelize";

const ArisanDraw = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ArisanDrawModel = sequelize.define(
    "arisan_draws",
    {
      arisan_draw_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      arisan_batch_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      winner_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      draw_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      draw_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      disbursement_amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'PENDING',
        allowNull: false,
      },
      transfer_proof: {
        type: DataTypes.STRING,
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

  return ArisanDrawModel;
};

export default ArisanDraw;
