module.exports = (sequelize, Sequelize) => {
    const Startup = sequelize.define("startup", {
      company_name: {
        type: Sequelize.STRING,
        allowNull: false,  // set constraints for company_name
        unique: true
      },
      email_address: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      company_password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profile_description: {
        type: Sequelize.STRING
      },
      profile_photo: {
        type: Sequelize.STRING
      },
      cap_table: {
        type: Sequelize.STRING
      },
      acra_documents: {
        type: Sequelize.STRING
      },
      pitch_deck: {
        type: Sequelize.STRING
      },
    });
  
    return Startup;
  };