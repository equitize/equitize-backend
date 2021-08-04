const db = require("../models");
const Industries = db.industries;
const Op = db.Sequelize.Op;


const industriesList = [
    "Finance", "Agriculture", "Environment", "Telecommunications",
    "Transport", "Education", "Healthcare and Medical", 
    "Entertainment", "Food and Beverages", "Others"
]

module.exports = {
    createIndustries : function (id, industryNames, accountType) {
        try {
            const placeholder = []
            for (var i = 0; i < industryNames.length; i ++) {
                dict = {};
                dict['name'] = industryNames[i];
                if (accountType === 'startup') { 
                    dict['startupId'] = id;
                    dict['id'] = 10007 + id * 12 + industriesList.indexOf(industryNames[i]);  // require unique
                }
                else if (accountType === 'retailInvestor') {
                    dict['retailInvestorId'] = id;
                    dict['id'] = id * 12 + industriesList.indexOf(industryNames[i]);  // require unique
                }
                placeholder.push(dict)
            }
            console.log(placeholder)
            // console.log(placeholder)
            return Industries.bulkCreate(placeholder)
            .then((industries) => {
                // console.log(">> industries: " + JSON.stringify(industries, null, 4));
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