const db = require("../models");
const Campaign = db.campaign;
const Op = db.Sequelize.Op;

module.exports = {
    create : function (campaign) {
        try {
            const result = Campaign.create(campaign)
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
    findAll : function (company_id) {
        try {
            var condition = company_id ? { company_id: { [Op.like]: `%${company_id}%` } } : null;

            const result = Campaign.findAll({ where: condition })
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
            const result = Campaign.findByPk(id)
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
            const result = Campaign.update(updates, { 
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
            const result = Campaign.destroy({ where: { id : id }})
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
            const result = Campaign.destroy({
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
    findViaCompanyId : function (company_id) {
        try {
            var condition = company_id ? { company_id: { [Op.like]: `${company_id}` } } : null;

            const result = Campaign.findAll({ where: condition })
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