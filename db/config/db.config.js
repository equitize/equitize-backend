module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "Deadbarney123!", //insert your own password here
    DB: "testdb", //make sure database with this name is instantiated on your mysql
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };