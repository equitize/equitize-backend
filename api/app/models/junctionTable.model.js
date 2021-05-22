module.exports = (sequelize, Sequelize) => {
    const JunctionTable = sequelize.define("junctionTable", {
      retail_investor_email: {
        type: Sequelize.STRING
      },
      company_name: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.INTEGER
      },
    });
  
    return JunctionTable;
  };