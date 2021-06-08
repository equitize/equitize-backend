let dbConfig;

if (process.env.NODE_ENV === "prod") {
  dbConfig = require("../config/cloudSQL.config.js");
} else if (process.env.NODE_ENV === "dev") {
  dbConfig = require("../config/db.config.js");
}


const Sequelize = require("sequelize");

sequelize_config = {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,  // false

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },

  define: {
    freezeTableName: true
  }
};

// disable logging in test
if (process.env.NODE_ENV == 'test') {
  sequelize_config.logging = false
}

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, sequelize_config)

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