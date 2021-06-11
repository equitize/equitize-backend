module.exports = (sequelize, Sequelize) => {
    const Milestone = sequelize.define("milestone", {
      companyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
      },
    },{
      tableName: 'milestones',
      freezeTableName: true
    });

    return Milestone;
  };