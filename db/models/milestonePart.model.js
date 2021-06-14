module.exports = (sequelize, Sequelize) => {
    const MilestonePart = sequelize.define("milestonePart", {
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      part: {
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
      percentageFunds:{
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },{
      tableName: 'milestonePart',
      freezeTableName: true
    });
  
    return MilestonePart;
  };