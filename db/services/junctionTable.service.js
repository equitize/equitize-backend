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
    findAll : function (company_name) {
        try {
            var condition = company_name ? { company_name: { [Op.like]: `%${company_name}%` } } : null;

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
    findViaCompanyName : function (company_name) {
        try {
            var condition = company_name ? { company_name: { [Op.like]: `${company_name}` } } : null;
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
    findViaRetailInvestor : function (retail_investor_email) {
        try {
            var condition = retail_investor_email ? { retail_investor_email: { [Op.like]: `${retail_investor_email}` } } : null;
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