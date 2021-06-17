const createHttpError = require("http-errors");
const zilliqaService = require("../services/zilliqa.service");
const milestonePartController = require("../../db/controllers/milestonePart.controller");

module.exports = {
    getZilAmt : function (req, res) { 
        console.log("zilliqa controller getZilAmt >>" )
        const campaign = req.body.campaign; // object
        const milestones = req.body.milestones; // array of 3 milestonePart object
        try {
            // const goal = campaign.dataValues[goal];
            // console.log(goal)
            const campaignGoal = campaign.dataValues["goal"] ? campaign.dataValues["goal"] : null;
            if ( campaignGoal == null ) throw createHttpError.NotFound(); 
            milestones.forEach(milestonePart => {
                console.log(milestonePart.dataValues["part"])
                console.log(milestonePart.dataValues["percentageFunds"])
            })
            // console.log(milestones)
            
        } catch (error) {
            next(error);
        }
    },
    // middleware to get a Milestone with the specified id in the request
    getMilestone : async (req, res, next) => {
        console.log("zilliqa controller getmilestone >>")
        const startup = req.body.startup;
        const startupId = req.params.startupId;
        try {
            const result = await startup.getMilestones();
            if ( result.length != 0 ) {
                req.body.milestones = result
                next()
            } else {
                res.status(500).send({
                message: `Cannot get Milestone with startupId=${startupId}. Maybe Milestone was not found!`
                });
            }
        
        } catch (error) {
            return error
        }
    },
    // middleware to get campaign associated with startupId in params
    getCampaigns : async (req, res, next) => {
        console.log("zilliq controller getcampaigns >>")
        const startup = req.body.startup; 
        try {
          const result = await startup.getCampaigns();
          if (!result) {
            throw createHttpError.NotFound();
          }
          else if ( result.length != 0 ) {
            req.body.campaign = result[0];
            next();
          }
        } catch (error) {
          next(error);
        }
      }
} 
