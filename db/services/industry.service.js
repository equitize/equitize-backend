const db = require("../models");
const Industries = db.industries;
const Op = db.Sequelize.Op;

module.exports = {
    createIndustries : function (id, industryNames, accountType) {
        try {
            const placeholder = []
            for (var i = 0; i < industryNames.length; i ++) {
                dict = {};
                dict['name'] = industryNames[i];
                if (accountType === 'startup') { 
                    dict['startupId'] = id;
                }
                else if (accountType === 'retailInvestor') {
                    dict['retailInvestorId'] = id;
                }
                placeholder.push(dict)
            }   
            console.log(placeholder)
            return Industries.bulkCreate(placeholder)
            .then((industries) => {
                console.log(">> industries: " + JSON.stringify(industries, null, 4));
                return industries;
            })
            .catch((err) => {
                console.log(">> Error while creating industries: ", err);
                throw err
            });
        } catch (err) {
            throw err
        }
    },
    
}