import { Sequelize } from "sequelize";

const pus = new Sequelize("pus", "admin", "qwerty123!!", {
  host: "202.52.147.193",
  dialect: "mysql",

  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },

  // Opsi koneksi MySQL
  dialectOptions: {
    dateStrings: true, // Pastikan tanggal dibaca sebagai string, bukan objek Date
    typeCast: true, // Izinkan parsing manual
    timezone: "+07:00", // Pastikan koneksi MySQL ikut WIB
  },

  timezone: "+07:00", // Agar Sequelize otomatis offset ke WIB

  logging: false,
});

export default pus;
