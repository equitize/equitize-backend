let password = 'Happymon10!'
if (process.env.GITHUB_ACTIONS == 'true') {
  password = 'root';
} 

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "Happymon10!", //insert your own password above, but do not commit
    DB: "testdb", //make sure database with this name is instantiated on your mysql
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };