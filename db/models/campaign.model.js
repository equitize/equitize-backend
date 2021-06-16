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
      currentlyRaised: {
        type: Sequelize.FLOAT,
        // allowNull: false
      },
      zoomDatetime: {
        type: Sequelize.STRING
      },
      startDate: {
        type: Sequelize.STRING,
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
      },
      campaignAddr: {
        type: Sequelize.STRING
      },
      fungibleTokenAddr: {
        type: Sequelize.STRING
      }
    },{
      tableName: 'campaigns',
      freezeTableName: true
    });
  
    return Campaign;
  };


