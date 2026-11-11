import { Sequelize } from "sequelize";

// Detect dialect from environment (mysql or sqlite)
// Default to mysql for production compatibility
const dialect = process.env.DB_DIALECT || "mysql";

const sequelizeOptions = {
  dialect: dialect,

  pool: {
    max: parseInt(process.env.DB_POOL_MAX || "20", 10),
    min: parseInt(process.env.DB_POOL_MIN || "2", 10),
    acquire: 60000,
    idle: 30000,
  },

  // SQLite doesn't support timezone configuration
  // Only set timezone for MySQL
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    connectTimeout: 10000,
  },

  logging: process.env.NODE_ENV === "development" ? console.log : false,
  retry: {
    max: 3,
    timeout: 15000,
  },
};

// MySQL specific options
if (dialect === "mysql") {
  sequelizeOptions.host = process.env.DB_HOST;
  sequelizeOptions.port = parseInt(process.env.DB_PORT || "3306", 10);
  sequelizeOptions.timezone = "+07:00";
}

// SQLite specific options
if (dialect === "sqlite") {
  sequelizeOptions.storage = process.env.DB_STORAGE || "./database/local-dev.sqlite";
}

const pus = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  sequelizeOptions,
);