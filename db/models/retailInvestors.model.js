module.exports = (sequelize, Sequelize) => {
    const RetailInvestors = sequelize.define("retailInvestor", {
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      auth0ID: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.STRING
      },
      singPass: {
        type: Sequelize.STRING
      },
      incomeStatement: {
        type: Sequelize.STRING
      },
      incomeTaxReturn: {
        type: Sequelize.STRING
      },
      zilAddr: {
        type: Sequelize.STRING
      }
    },{
      tableName: 'retailInvestors',
      freezeTableName: true
    });
  
    return RetailInvestors;
  };