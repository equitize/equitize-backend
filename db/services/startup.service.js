const db = require("../models");
const Startup = db.startups;
const Op = db.Sequelize.Op;

module.exports = {
    create : function (startup) {
        try {
            const result = Startup.create(startup)
            .then(data => {
                return data
            })
            .catch(err => {
                throw err
            });
            return result

        } catch (error) {
            return (error)
        }
    },
    findAll : function (companyName) {
        try {
            var condition = companyName ? { companyName: { [Op.like]: `%${companyName}%` } } : null;

            const result = Startup.findAll({ where: condition, include: ["milestones", "industries", "campaigns"] })
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
    findOne : function (id) {
        try {
            // const result = Startup.findByPk(id, { include: ["milestones", "industries", "campaigns"] })
            const result = Startup.findByPk(id, { include: { all : true } })
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
            const result = Startup.update(updates, { 
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
            const result = Startup.destroy({ where: { id : id }})
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
    deleteAll : function() {
        try {
            const result = Startup.destroy({
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
            var condition = companyName ? { companyName: { [Op.like]: `${companyName}` } } : null;

            const result = Startup.findAll({ where: condition })
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
    findViaEmail : function (emailAddress) {
        try {
            var condition = emailAddress ? { emailAddress: { [Op.like]: `${emailAddress}` } } : null;

            const result = Startup.findAll({ where: condition })
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
}