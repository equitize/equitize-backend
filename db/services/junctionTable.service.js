const db = require("../models");
const JunctionTable = db.junctionTable;
const Op = db.Sequelize.Op;

module.exports = {
    create : function (junctionTable) {
        try {
            const result = JunctionTable.create(junctionTable)
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

            const result = JunctionTable.findAll({ where: condition })
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
            const result = JunctionTable.findByPk(id)
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
            const result = JunctionTable.update(updates, { 
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
            const result = JunctionTable.destroy({ where: { id : id }})
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
            const result = JunctionTable.destroy({
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
    findViaCompanyName : function (companyName) {
        try {
            var condition = companyName ? { companyName: { [Op.like]: `${companyName}` } } : null;
            const result = JunctionTable.findAll({ where: condition })
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
    findViaRetailInvestor : function (retailInvestorEmail) {
        try {
            var condition = retailInvestorEmail ? { retailInvestorEmail: { [Op.like]: `${retailInvestorEmail}` } } : null;
            const result = JunctionTable.findAll({ where: condition })
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