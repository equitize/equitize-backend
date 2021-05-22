module.exports = (sequelize, Sequelize) => {
    const RetailInvestors = sequelize.define("retailInvestors", {
      email_address: {
        type: Sequelize.STRING
      },
      user_password: {
        type: Sequelize.STRING
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      singpass: {
        type: Sequelize.STRING
      },
      income_statement: {
        type: Sequelize.STRING
      },
      income_tax_return: {
        type: Sequelize.STRING
      },
    });
  
    return RetailInvestors;
  };