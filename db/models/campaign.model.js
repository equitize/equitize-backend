module.exports = (sequelize, Sequelize) => {
    const Campaign = sequelize.define("campaign", {
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // unique: true
      },
      goal: {
        type: Sequelize.INTEGER,
        // allowNull: false
      },
      endDate: {
        type: Sequelize.STRING,
        // allowNull: false
      },
      sharesAllocated: {
        type: Sequelize.FLOAT,
      },
      campaignDescription: {
        type: Sequelize.STRING,
      },
      tokensMinted: {
        type: Sequelize.INTEGER,
      } 
    });
  
    return Campaign;
  };