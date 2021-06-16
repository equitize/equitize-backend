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
            console.log(">> milestonePart: " + JSON.stringify(milestonePart, null, 4));
            console.log(milestonePart)
            return milestonePart;
        })
        .catch((err) => {
            console.log(">> Error while creating milestonePart: ", err);
        });
    }, 

    findMilestonePartById : function (id) {
        return MilestoneParts.findByPk(id, { include: ["milestone"] })
        .then((milestonePart) => {
            return milestonePart;
        })
        .catch((err) => {
            console.log(">> Error while finding milestonePart: ", err);
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
                console.log(data)
                return data
            })
            .catch(err => {
                
                throw err    
            });
            return result
        } catch (error) {
            console.log(error)
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
                console.log('data section of delete fuinction ')
                console.log(data)
                return data
            })
            .catch(err => {
                throw err    
            });
            return result
        } catch (error) {
            console.log('alskdjfhalsdkjfh')
            console.log(error)
            return error
        }
    }
}
