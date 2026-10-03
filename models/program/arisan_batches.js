import { Sequelize } from "sequelize";

const ArisanBatch = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ArisanBatchModel = sequelize.define(
    "arisan_batches",
    {
      arisan_batch_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      arisan_program_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      batch_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      period_start_month: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      period_start_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      participants_quota: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'DRAFT',
      },
      monthly_installment: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: true,
      },
      jumlah_keberangkatan: {
        type: DataTypes.INTEGER,
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

  return ArisanBatchModel;
};

export default ArisanBatch;
