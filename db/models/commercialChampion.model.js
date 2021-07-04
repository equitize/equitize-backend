module.exports = (sequelize, Sequelize) => {
  // name, email, profession, fields of interest
    const CommercialChampion = sequelize.define("commercialChampion", {
      startupId:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profession: {
        type: Sequelize.STRING,
      },
      fieldsOfInterest: {
        type: Sequelize.STRING,
      },
    },{
      tableName: 'commercialChampions',
      freezeTableName: true
    });
  
    return CommercialChampion;
  };