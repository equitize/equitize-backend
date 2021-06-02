const db = require("../models");
const RetailInvestors = db.retailInvestors;
const Op = db.Sequelize.Op;

module.exports = {
    create : function (retailInvestor) {
        try {
            const result = RetailInvestors.create(retailInvestor)
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
    findAll : function (email_address) {
        try {
            var condition = email_address ? { email_address: { [Op.like]: `%${email_address}%` } } : null;
            const result = RetailInvestors.findAll({ where: condition })
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
            const result = RetailInvestors.findByPk(id)
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
    update : function (updates, id) {
        try {
            const result = RetailInvestors.update(updates, {
                where: { id: id }
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
    delete : function (id) {
        try {
            const result = RetailInvestors.destroy({
                where: { id: id }
            })
            .then(data => {
                return data
            })
            .catch(err => {
                throw err
            });
            return result
        } catch (erorr) {
            return error
        }
    },
    deleteAll : function () {
        try {
            const result = RetailInvestors.destroy({
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
    findViaEmail : function(email) {
        try {
            var condition = email ? { email_address: { [Op.like]: `${email}` } } : null;
            const result = RetailInvestors.findAll({ where: condition })
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