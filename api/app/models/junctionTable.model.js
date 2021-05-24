module.exports = (sequelize, Sequelize) => {
    const JunctionTable = sequelize.define("junctionTable", {
      retail_investor_email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      company_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    });
  
    return JunctionTable;
  };