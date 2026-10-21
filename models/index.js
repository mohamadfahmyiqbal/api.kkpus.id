// models/index.js
import sequelizeInstance from "../config/pus.js";
import { Sequelize } from "sequelize";
import initModels from "./initModels.js";
import defineAssociations from "./associations.js";
import { initCooperativeBanks } from "../services/cooperativeBankInit.js";

const db = {};
db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

initModels(db, sequelizeInstance, Sequelize.DataTypes);
defineAssociations(db);

// Otomatis sinkronisasi tabel rekening koperasi & buat mock data saat inisialisasi DB
initCooperativeBanks(db);

export default db;