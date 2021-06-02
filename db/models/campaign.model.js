module.exports = (sequelize, Sequelize) => {
    const Campaign = sequelize.define("campaign", {
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // unique: true
      },
      goal: {
        type: Sequelize.INTEGER,
        // allowNull: false
      },
      end_date: {
        type: Sequelize.STRING,
        // allowNull: false
      },
      sharesAllocated: {
        type: Sequelize.FLOAT,
      },
      campaign_description: {
        type: Sequelize.STRING,
      },
      tokensMinted: {
        type: Sequelize.INTEGER,
      } 
    });
  
    return Campaign;
  };