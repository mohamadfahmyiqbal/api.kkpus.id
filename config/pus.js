import { Sequelize } from "sequelize";

// Menggunakan konfigurasi dari environment variables
const pus = new Sequelize(
  process.env.DB_NAME || "koperasi",
  process.env.DB_USER || "admin",
  process.env.DB_PASSWORD || "qwerty123!!",
  {
    host: process.env.DB_HOST || "202.52.147.193",
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
      connectTimeout: 10000,
    },

    timezone: "+07:00",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    retry: {
      max: 3,
      timeout: 5000,
    },
  },
);

export default pus;
