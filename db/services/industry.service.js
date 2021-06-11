const db = require("../models");
const Industries = db.industries;
const Op = db.Sequelize.Op;

module.exports = {
    createIndustry : function (startupId, industryName) {
        return Industries.create({
            name: industryName,
            startupId: startupId,
        })
        .then((industry) => {
            console.log(">> industry: " + JSON.stringify(industry, null, 4));
            return industry;
        })
        .catch((err) => {
            console.log(">> Error while creating industry: ", err);
        });
    }
}