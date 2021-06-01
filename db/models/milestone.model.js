module.exports = (sequelize, Sequelize) => {
    const Milestone = sequelize.define("milestone", {
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      milestone_part: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      end_date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
      },
      amount:{
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  
    return Milestone;
  };