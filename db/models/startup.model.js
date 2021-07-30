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
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      auth0ID: {
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
      pitchDeckCloudID: {
        type: Sequelize.STRING
      },
      pitchDeckOriginalName : {
        type: Sequelize.STRING
      },
      videoCloudID:{
        type: Sequelize.STRING
      },
      videoOriginalName: {
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
      zilAddr: {
        type: Sequelize.STRING
      }
    },{
      tableName: "startups",
      freezeTableName: true
    });
    return Startup;
  };