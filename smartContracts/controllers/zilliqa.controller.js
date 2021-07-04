const createHttpError = require("http-errors");
const campaignService = require("../../db/services/campaign.service");
const dbConstants = require("../../db/constants/constants");

module.exports = {
    getZilAmt : function (req, res, next) { 
        const campaign = req.body.campaign ? req.body.campaign : ""; // object
        const milestones = req.body.milestones ? req.body.milestones : ""; // array of 3 milestonePart object
        try {
            const campaignGoal = campaign.goal ? campaign.goal : null;
            if ( campaignGoal == null ) throw createHttpError.NotFound(); 
            req.body.milestones = {};
            req.body.milestones["campaignGoal"] = campaignGoal;
            for (i = 0; i < milestones.length; i++) {
                const milestonePartGoal = ( milestones[i].percentageFunds / 100 ) * campaignGoal;
                req.body.milestones[`part${milestones[i].part}Goal`] = milestonePartGoal;
            }
            next();
        } catch (error) {
            next(error);
        }
    },
    // middleware to get a Milestone with the specified id in the request
    getMilestone : async (req, res, next) => {
        
        const startup = req.body.startup ? req.body.startup : "";
        const startupId = req.params.startupId ? req.params.startupId : "";
        try {
            const milestones = await startup.getMilestones();
            if ( milestones.length != 0 ) {
                req.body.milestones = JSON.parse(JSON.stringify(milestones));
                next();
            } else {
                
                res.status(500).send({
                message: `Cannot get Milestone with startupId=${startupId}. Maybe Milestone was not found!`
                });
            }
        
        } catch (error) {
            next(error)
        }
    },
    // middleware to get campaign associated with startupId in params
    getCampaigns : async (req, res, next) => {
        const startup = req.body.startup ? req.body.startup : ""; 
        try {
            const campaign = await startup.getCampaign();
            if (!campaign) {
                throw createHttpError.NotFound();
            }
            else if ( campaign ) {
                req.body.campaign = JSON.parse(JSON.stringify(campaign));
                next();
            }
        } catch (error) {
            next(error);
        }
      },
      checkSCstatus : (req, res, next) => {
        try {
          const SCstatus = req.body.SCstatus ? req.body.SCstatus :"";
          const startupId = req.params.startupId ? req.params.startupId : "";
          const campaign = req.body.campaign ? req.body.campaign : "";
          
          if ( SCstatus.milestoneSC.status === true && SCstatus.fungibleTokenSC.status === true ) {
                const updates = { campaignStatus :  dbConstants.campaign.status.LIVE }
                campaignService.update(updates, startupId)
                res.status(200).send({
                startupId: startupId,
                message: "Milestone SC and Fungible Token SC succesfully deployed.",
                milestoneSCaddress: SCstatus.milestoneSC.address,
                fungibleTokenSCaddress: SCstatus.fungibleTokenSC.address
                });
          } else {
            res.status(500).send("Error deploying Milestone SC and Fungible Token SC.")
          }
        } catch (error) {
          next(error)
        }
    }
} 
