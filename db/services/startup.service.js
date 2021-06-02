const db = require("../models");
const Startup = db.startup;
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
                // return err.message
            })
            return result

        } catch (error) {
            return (error)
        }
        // Startup.create(startup)
        // .then(function (data) {
            // console.log('data here')
            // console.log(data)
            // return data
            
        // })
        // .catch(err => {
            // return err
        //     res.status(500).send({
        // message:
        //     err.message || "Some error occurred while creating the Startup."
        // });
    }
}