module.exports = (sequelize, Sequelize) => {
    const Startup = sequelize.define("startup", {
      companyName: {
        type: Sequelize.STRING,
        allowNull: false,  // set constraints for company_name
        unique: true
      },
      emailAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      companyPassword: {
        type: Sequelize.STRING,
        allowNull: false
      },
      profileDescription: {
        type: Sequelize.STRING
      },
      profilePhoto: {
        type: Sequelize.STRING
      },
      capTable: {
        type: Sequelize.STRING
      },
      acraDocuments: {
        type: Sequelize.STRING
      },
      pitchDeck: {
        type: Sequelize.STRING
      },
      video:{
        type: Sequelize.STRING
      },
      zoomDatetime: {
        type: Sequelize.STRING
      },
      commericalChampion: {
        type: Sequelize.STRING
      },
      designSprintDatetime: {
        type: Sequelize.STRING
      },
      bankInfo: {
        type: Sequelize.STRING
      },
      idProof: {
        type: Sequelize.STRING
      },
    },{
      tableName: "startups",
      freezeTableName: true
    });
    return Startup;
  };