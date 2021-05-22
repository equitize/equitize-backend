module.exports = (sequelize, Sequelize) => {
    const Campaign = sequelize.define("campaign", {
      company_name: {
        type: Sequelize.STRING
      },
      goal: {
        type: Sequelize.INTEGER
      },
      end_date: {
        type: Sequelize.STRING
      },
    });
  
    return Campaign;
  };