import { Sequelize } from "sequelize";

// Menggunakan konfigurasi sesuai request Anda
const pus = new Sequelize("koperasi", "admin", "qwerty123!!", {
  host: "202.52.147.193",
  dialect: "mysql",

  pool: {
    max: 20,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },

  dialectOptions: {
    dateStrings: true, 
    typeCast: true, 
    timezone: "+07:00", 
  },

  timezone: "+07:00", 
  logging: false,
});

export default pus;