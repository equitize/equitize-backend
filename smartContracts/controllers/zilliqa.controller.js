const createHttpError = require("http-errors");

module.exports = {
    getZilAmt : function (req, res, next) { 
        const campaign = req.body.campaign; // object
        const milestones = req.body.milestones; // array of 3 milestonePart object
        try {
            const campaignGoal = campaign.dataValues["goal"] ? campaign.dataValues["goal"] : null;
            if ( campaignGoal == null ) throw createHttpError.NotFound(); 
            req.body.milestones = {};
            req.body.milestones["campaignGoal"] = campaignGoal;
            for (i = 0; i < milestones.length; i++) {
                const milestonePartGoal = ( milestones[i].dataValues["percentageFunds"] / 100 ) * campaignGoal;
                req.body.milestones[`part${milestones[i].dataValues["part"]}Goal`] = milestonePartGoal;
            }
            next()
            
        } catch (error) {
            next(error);
        }
    },
    // middleware to get a Milestone with the specified id in the request
    getMilestone : async (req, res, next) => {
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
            
            next(error)
        }
    },
    // middleware to get campaign associated with startupId in params
    getCampaigns : async (req, res, next) => {
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
      },
      checkSCstatus : (req, res, next) => {
        try {
          const SCstatus = req.body.SCstatus;
          const startupId = req.params.startupId;
          
          if ( SCstatus.milestoneSC.status === true && SCstatus.fungibleTokenSC.status === true ) {
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
