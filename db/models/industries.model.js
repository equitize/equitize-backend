module.exports = (sequelize, Sequelize) => {
    const Industry = sequelize.define("industry", {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      
    },{
      tableName: 'industries',
      freezeTableName: true
    });
  
    return Industry;
  };