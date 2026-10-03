import { Sequelize } from "sequelize";

// Menggunakan konfigurasi dari environment variables
const pus = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",

    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "20", 10),
      min: parseInt(process.env.DB_POOL_MIN || "2", 10),
      acquire: 60000,
      idle: 30000,
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
      timeout: 15000,
    },
  },
);

export default pus;
