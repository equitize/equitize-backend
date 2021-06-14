module.exports = (sequelize, Sequelize) => {
    const JunctionTable = sequelize.define("junctionTable", {
      retailInvestorId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    },{
      tableName: 'junctionTable',
      freezeTableName: true
    });
  
    return JunctionTable;
  };