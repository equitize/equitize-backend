module.exports = (sequelize, Sequelize) => {
    const JunctionTable = sequelize.define("junctionTable", {
      retail_investor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    });
  
    return JunctionTable;
  };