const db = require("../models");
const retailInvLog = db.retailInvLog;
const Op = db.Sequelize.Op;

module.exports = {
    create : (log) => {
        try {
            const result = retailInvLog.create(log)
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
    findAll : () => {
        try {
            const retailInvLogs = retailInvLog.findAll()
            .then(data => {
                return data
            })
            .catch(err => {
                throw err
            });
            return retailInvLogs
        } catch (error) {
            return error
        }
    }
}