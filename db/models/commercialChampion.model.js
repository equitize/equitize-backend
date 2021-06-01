module.exports = (sequelize, Sequelize) => {
  // name, email, profession, fields of interest
    const CommercialChampion = sequelize.define("commercialChampion", {
      company_id:{
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
      fields_of_interest: {
        type: Sequelize.STRING,
      },
    });
  
    return CommercialChampion;
  };