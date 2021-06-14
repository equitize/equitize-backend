module.exports = (sequelize, Sequelize) => {
    const MilestonePart = sequelize.define("milestonePart", {
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
      amount:{
        type: Sequelize.INTEGER,
        allowNull: false
      }
    },{
      tableName: 'milestonePart',
      freezeTableName: true
    });
  
    return MilestonePart;
  };