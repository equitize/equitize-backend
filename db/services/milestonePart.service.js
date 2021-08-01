const db = require("../models");
const MilestoneParts = db.milestoneParts;
const Op = db.Sequelize.Op;

module.exports = {
    createMilestonePart : function (startupId, milestonePart) {
        
        return MilestoneParts.create({
            title: milestonePart.title,
            part: milestonePart.part,
            endDate: milestonePart.endDate,
            description: milestonePart.description,
            percentageFunds: milestonePart.percentageFunds,
            startupId: startupId,
        })
        .then((milestonePart) => {
            // console.log(">> milestonePart: " + JSON.stringify(milestonePart, null, 4));
            return {status: 200, milestonePart: milestonePart};
        })
        .catch((err) => {
            console.log(">> Error while creating milestonePart: ", err);
            return {status: 500, error: err};
        });
    }, 

    findMilestonePartById : function (id) {
        return MilestoneParts.findByPk(id, { include: ["milestone"] })
        .then((milestonePart) => {
            return milestonePart;
        })
        .catch((err) => {
            console.log(">> Error while finding milestonePart: ", err);
            return err
        });
    }, 


    deletePart : function(startupId, milestonePart) {
        try {
            const id = startupId ? startupId : null;
            const part = milestonePart ? milestonePart : null;
            var condition = { 
                startupId: { [Op.like]: `%${id}%` },
                part: { [Op.like]: `%${part}%` }
            };
            const result = MilestoneParts.destroy({ where: condition })
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
    delete : function(startupId) {
        try {
            const id = startupId ? startupId : null;
            
            var condition = { 
                startupId: { [Op.like]: `%${id}%` }
            };
            const result = MilestoneParts.destroy({ where: condition })
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
            const result = MilestoneParts.findAll(condition, attributes)
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
