module.exports = (sequelize, Sequelize) => {
    const Campaign = sequelize.define("campaign", {
      company_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      goal: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      end_date: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  
    return Campaign;
  };