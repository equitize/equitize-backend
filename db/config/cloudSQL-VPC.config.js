// for private IP configuration on Cloud SQL side
module.exports = {
    HOST: process.env.SQL_HOST,
    USER: process.env.SQL_USER,
    PASSWORD: process.env.SQL_PASSWORD, 
    DB: process.env.SQL_DB,
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };

