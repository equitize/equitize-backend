const db = require("../models");
const Milestones = db.milestones;
const MilestonePart = db.milestoneParts
// const Milestone = require("../models/milestone.model");
// const MilestonePart = require("../models/milestonePart.model");
const Op = db.Sequelize.Op;

module.exports = {
    create : function (milestone) {
        
        try {
            const result = Milestones.create(milestone)
            .then(data => {
                return data
            })
            .catch(err => {
                throw err
            });
            return result
        } catch (error) {
            return error
        }
    }, 
    findMilestoneById : function (milestoneId) {
        return Milestones.findByPk(milestoneId, { include: ["milestoneParts"] })
          .then((milestone) => {
            return milestone;
          })
          .catch((err) => {
            console.log(">> Error while finding milestone: ", err);
          });
    },
    // findAll : function (companyId) {
    //     try {
    //         var condition = companyId ? { companyId: { [Op.like]: `%${companyId}%` } } : null;

    //         const result = Milestone.findAll({ where: condition })
    //         .then(data => {
    //             return data
    //         })
    //         .catch(err => {
    //             throw err
    //         });
    //         return result
    //     } catch (error) {
    //         return error
    //     }
    // },
    findAll : function () {
        return Milestones.findAll({
          include: ["milestoneParts"],
        }).then((milestones) => {
          return milestones;
        });
    },
    findOne : function (id) {
        try {
            const result = Milestone.findByPk(id)
            .then(data => {
                return data
            })
            .catch(err => {
                throw err    
            });
            return result
        } catch (error) {
            return error
        }
    },
    update : function(updates, id) {
        try {
            const result = Milestone.update(updates, { 
                where : { id : id }
            })
            .then(data => {
                return data
            })
            .catch(err => {
                throw err    
            });
            return result
        } catch (error) {
            return error
        }
    },
    delete : function(id) {
        try {
            const result = Milestones.destroy({ where: { id : id }})
            .then(data => {
                console.log(data)
                return data
            })
            .catch(err => {
                
                throw err    
            });
            return result
        } catch (error) {
            console.log(error)
            return error
        }
    },
    deleteAll : function() {
        try {
            const result = Milestone.destroy({
                where: {},
                truncate: false
            })
            .then(data => {
                return data
            })
            .catch(err => {
                throw err    
            });
            return result
        } catch (error) {
            return error
        }
    },
    findViaName : function (companyName) {
        try {
            var condition = companyName ? { name: { [Op.like]: `${companyName}` } } : null;

            const result = Milestone.findAll({ where: condition })
            .then(data => {
                return data
            })
            .catch(err => {
                throw err    
            });
            return result
        } catch (error) {
            return error
        }
    },
    findViaCompanyId : function (companyId) {
        try {
            var condition = companyId ? { companyId: { [Op.like]: `${companyId}` } } : null;
            const result = Milestone.findAll({ where: condition })
            .then(data => {
                return data
            })
            .catch(err => {
                throw err    
            });
            return result
        } catch (error) {
            return error
        }
    }
}