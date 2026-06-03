// models/index.js
import sequelizeInstance from "../config/pus.js";
import { Sequelize } from "sequelize";
import initModels from "./initModels.js";
import defineAssociations from "./associations.js";

const db = {};
db.sequelize = sequelizeInstance;
db.Sequelize = Sequelize;

initModels(db, sequelizeInstance, Sequelize.DataTypes);
defineAssociations(db);

export default db;