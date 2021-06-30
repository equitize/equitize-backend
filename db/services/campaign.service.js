const db = require("../models");
const Campaign = db.campaigns;
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
    findAllByCompanyID : function (companyId) {
        try {
            var condition = companyId ? { companyId: { [Op.like]: `%${companyId}%` } } : null;

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
    update : function(updates, startupId) {
        try {
            const result = Campaign.update(updates, { 
                where : { startupId : startupId }
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
    findViaCompanyId : function (startupId) {
        try {
            var condition = startupId ? { startupId: { [Op.like]: `${startupId}` } } : null;

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
    findAll : function (condition, attributes) {
        try {
            const result = Campaign.findAll(condition, attributes)
            .then(data => {
                return data;
            })
            .catch(err => {
                throw err
            })
            return result;
        } catch (error) {
            return error
        }
    }
}