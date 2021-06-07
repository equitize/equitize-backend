module.exports = (sequelize, Sequelize) => {
    const Milestone = sequelize.define("milestone", {
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
      },
      milestonePart: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      endDate: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
      },
      amount:{
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },{
      tableName: 'milestone',
      freezeTableName: true
    });
  
    return Milestone;
  };