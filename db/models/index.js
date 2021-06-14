let dbConfig;

if (process.env.NODE_ENV === "prod") {
  dbConfig = require("../config/cloudSQL.config.js");
} else if (process.env.NODE_ENV === "dev" || process.env.NODE_ENV === "test") {
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

db.startups = require("./startup.model.js")(sequelize, Sequelize);
db.retailInvestors = require("./retailInvestors.model.js")(sequelize, Sequelize);
db.campaign = require("./campaign.model.js")(sequelize, Sequelize);
db.junctionTable = require("./junctionTable.model.js")(sequelize, Sequelize);
db.commercialChampion = require("./commercialChampion.model.js")(sequelize, Sequelize);
db.milestoneParts = require("./milestonePart.model.js")(sequelize, Sequelize);
db.industries = require("./industries.model.js")(sequelize, Sequelize);

// db.milestones.hasMany(db.milestoneParts, { onDelete: "cascade", as: "milestoneParts" });
db.startups.hasMany(db.milestoneParts, { onDelete: "cascade", as: "milestones" })
db.startups.hasMany(db.industries, { onDelete: "cascade", as: "industries" })
db.retailInvestors.hasMany(db.industries, { onDelete: "cascade", as : "industryPreferences" })

db.milestoneParts.belongsTo(db.startups , { foreignKey: "startupId",  as: "startup" });
db.industries.belongsTo(db.startups , { foreignKey: "startupId",  as: "startup" });
db.industries.belongsTo(db.retailInvestors, {foreignKey: "retailInvestorId", as: "retailInvestor" });

module.exports = db;