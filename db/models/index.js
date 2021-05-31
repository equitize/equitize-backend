const dbConfig = require("../config/db.config.js");
// console.log(dbConfig.HOST);
// console.log(dbConfig.pool.max);

const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,  // false

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.startup = require("./startup.model.js")(sequelize, Sequelize);
db.retailInvestors = require("./retailInvestors.model.js")(sequelize, Sequelize);
db.campaign = require("./campaign.model.js")(sequelize, Sequelize);
db.junctionTable = require("./junctionTable.model.js")(sequelize, Sequelize);
db.commercialChampion = require("./commercialChampion.model.js")(sequelize, Sequelize);
db.milestone = require("./milestone.model.js")(sequelize, Sequelize);

module.exports = db;