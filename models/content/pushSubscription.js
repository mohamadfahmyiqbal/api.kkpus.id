// src/models/content/pushSubscription.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  const PushSubscription = sequelize.define(
    "PushSubscription",
    {
      subscription_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      member_id: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      endpoint: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      p256dh: {
        // Diubah ke TEXT karena varchar(255) seringkali tidak cukup untuk menyimpan public key enkripsi browser
        type: DataTypes.TEXT,
        allowNull: false,
      },
      auth: {
        // Diubah ke TEXT untuk konsistensi penyimpanan kunci enkripsi
        type: DataTypes.TEXT,
        allowNull: false,
      },
      device_type: {
        type: DataTypes.STRING(50),
        defaultValue: "unknown",
      },
    },
    {
      tableName: "member_push_subscriptions",
      timestamps: true,
      indexes: [
        {
          // Menambahkan index unik pada endpoint untuk mencegah duplikasi perangkat.
          // MySQL membutuhkan prefix length (255) jika menggunakan tipe data TEXT.
          unique: true,
          name: "unique_endpoint_idx",
          fields: [
            {
              name: "endpoint",
              length: 255,
            },
          ],
        },
        {
          // Index pada member_id untuk mempercepat proses lookup saat pengiriman notifikasi
          name: "member_id_idx",
          fields: ["member_id"],
        },
      ],
    },
  );

  return PushSubscription;
};
