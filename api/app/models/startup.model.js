module.exports = (sequelize, Sequelize) => {
    const Startup = sequelize.define("startup", {
      company_name: {
        type: Sequelize.STRING
      },
      email_address: {
        type: Sequelize.STRING
      },
      company_password: {
        type: Sequelize.STRING
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