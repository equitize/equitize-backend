module.exports = (sequelize, Sequelize) => {
    const retailInvLog = sequelize.define("retailInvLog", {
      log: {
        type: Sequelize.STRING(10000),
        allowNull: false
      },
    },{
      tableName: 'retailInvLogs',
      freezeTableName: true
    });
  
    return retailInvLog;
  };