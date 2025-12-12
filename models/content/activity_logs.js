// 📁 models/content/activity_logs.js (KODE FINAL & FIXED)

import { Sequelize } from "sequelize";

const ActivityLog = (sequelize) => {
  const { DataTypes } = Sequelize;

  const ActivityLogModel = sequelize.define("ActivityLog", {
    // 🔥 FIX UTAMA: Ganti log_id ke activity_id
    activity_id: { 
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    member_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // Foreign Key Pelaku aktivitas
    },
    activity_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    // 🔥 FIX: Ganti 'description' ke 'detail'
    detail: { 
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // 🔥 FIX: Tambahkan kolom activity_datetime
    activity_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    // ip_address dihapus karena tidak ada di skema DB yang Anda sebutkan
  }, { 
    tableName: 'activity_logs', // Pastikan nama tabel benar
    freezeTableName: true, 
    timestamps: true,
    // FIX: Mapekan kolom created_at dan updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return ActivityLogModel;
};

export default ActivityLog;