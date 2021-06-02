const db = require("../models");
const CommercialChampion = db.commercialChampion;
const Op = db.Sequelize.Op;

module.exports = {
    create : function (commercialChampion) {
        try {
            const result = CommercialChampion.create(commercialChampion)
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
    findAll : function (name) {
        try {
            var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

            const result = CommercialChampion.findAll({ where: condition })
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
            const result = CommercialChampion.findByPk(id)
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
            const result = CommercialChampion.update(updates, { 
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
            const result = CommercialChampion.destroy({ where: { id : id }})
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
            const result = CommercialChampion.destroy({
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
    findViaName : function (name) {
        try {
            var condition = name ? { name: { [Op.like]: `${name}` } } : null;
            const result = CommercialChampion.findAll({ where: condition })
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
    findViaCompanyId : function (company_id) {
        try {
            var condition = company_id ? { company_id: { [Op.like]: `${company_id}` } } : null;
            const result = CommercialChampion.findAll({ where: condition })
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