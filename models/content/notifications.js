import { Sequelize } from "sequelize";

const Notification = (sequelize) => {
  const { DataTypes } = Sequelize;

  const NotificationModel = sequelize.define(
    "notifications",
    {
      notification_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      member_id: {
        type: DataTypes.BIGINT,
        allowNull: false, // Foreign Key Penerima
      },
      title: {
        type: DataTypes.STRING(255), // Sesuai varchar(255)
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT, // Sesuai text
        allowNull: false,
      },
      sent_datetime: {
        type: DataTypes.DATE, // Sesuai datetime
        allowNull: false,
        // Opsional: Anda dapat menggunakan defaultValue: DataTypes.NOW jika ingin default waktu server
      },
      status: {
        type: DataTypes.STRING(50), // Sesuai varchar(50)
        allowNull: false,
        defaultValue: "unread", // Asumsi: Status awal adalah 'unread'
      },
      // created_at dan updated_at ditangani oleh timestamps: true
    },
    {
      freezeTableName: true,
      timestamps: true,
      // Jika Anda ingin createdAt/updatedAt juga otomatis menggunakan sent_datetime
      // createdAt: 'created_at',
      // updatedAt: 'updated_at',
    }
  );

  // Catatan: Relasi harus didefinisikan di models/index.js
  // Contoh: NotificationModel.belongsTo(db.Member, { foreignKey: 'member_id', as: 'member' });

  return NotificationModel;
};

export default Notification;
