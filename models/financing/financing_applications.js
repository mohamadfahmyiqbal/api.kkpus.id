// 📁 src/models/financing/financing_applications.js
import { Sequelize } from "sequelize";

const FinancingApplication = (sequelize) => {
  const { DataTypes } = Sequelize;

  const FinancingApplicationModel = sequelize.define("financing_applications", {
    financing_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      field: 'financing_id'
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    business_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    purpose: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    // Kolom Tambahan Opsi B
    item_price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0,
    },
    down_payment: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0,
    },
    amount_requested: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      field: 'required_amount' // Mapping ke kolom asli di DB
    },
    cooperation_months: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    monthly_installment: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    margin_percent: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
    },
    margin_amount: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0,
    },
    total_tagihan: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    approval_flow_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    current_step_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    akad_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Murabahah'
    },
    collateral_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    is_rejected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Kolom untuk metode pencairan
    metode_pencairan: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'metode_pencairan'
    },
    // Field untuk Non Tunai (Transfer)
    no_rekening: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'no_rekening'
    },
    bank_tujuan: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'bank_tujuan'
    },
    // Field untuk Tunai
    lokasi_pencairan: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'lokasi_pencairan'
    },
    tanggal_pencairan: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'tanggal_pencairan'
    },
    jam_pencairan: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'jam_pencairan'
    },
    // Kolom tambahan
    nama_nasabah: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'nama_nasabah'
    },
    nama_peserta_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'nama_peserta_2'
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'keterangan'
    },
    arisan_batch_id: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'arisan_batch_id'
    },
    file_evidence: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'file_evidence'
    }
  }, { 
    freezeTableName: true, 
    underscored: false,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  FinancingApplicationModel.addHook('afterDestroy', async (instance, options) => {
    const t = options.transaction;
    if (sequelize.models.EntityStepApproval) {
      await sequelize.models.EntityStepApproval.destroy({
        where: { entity_id: String(instance.financing_id), entity_ref: 'financing_applications' },
        transaction: t
      });
    }
    if (sequelize.models.Approval) {
      await sequelize.models.Approval.destroy({
        where: { entity_id: String(instance.financing_id), entity_ref: 'financing_applications' },
        transaction: t
      });
    }
  });

  return FinancingApplicationModel;
};

export default FinancingApplication;