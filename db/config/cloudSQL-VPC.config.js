// for private IP configuration on Cloud SQL side
module.exports = {
    HOST: "10.252.128.3",
    USER: "equitize-backend",
    PASSWORD: process.env.SQL_PASSWORD, //insert your own password here
    DB: "equitize_cloudsql", //make sure database with this name is instantiated on your mysql
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

