module.exports = (sequelize, Sequelize) => {
    const RetailInvestors = sequelize.define("retailInvestor", {
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      userPassword: {
        type: Sequelize.STRING,
        allowNull: false
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
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
    },{
      tableName: 'retailInvestors',
      freezeTableName: true
    });
  
    return RetailInvestors;
  };