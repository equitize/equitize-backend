const campaignController = require("../../db/controllers/campaign.controller");
const axios = require("axios");
const moment = require("moment");
const cache = require("./cache");
var deployCount = 1;

module.exports = {
    testFunction : () => {
        console.log('runnning every 5 seconds')
    },
    checkCampaignGoal : async () => {
        try {
            if (deployCount === 0) { 
                return 
            }
            
            const attributes = {
                attributes: ['startDate', 'endDate', 'goal', 'currentlyRaised', 'startupId']
            }
            const conditions = {
                where : { SCdeployedStatus : false }
            }
            const campaigns = await campaignController.cronFindAll(conditions, attributes) // campaigns that are not yet live
            
            if (campaigns.length != 0) {
                for (let i=0; i < campaigns.length; i++) {
                    
                    const campaignStartDateTime = moment(campaigns[i].dataValues.startDate);
                    const campaignEndDateTime = moment(campaigns[i].dataValues.endDate);
                    const currentDateTime = moment();
                    const campaignGoal = campaigns[i].dataValues.goal;
                    const currentlyRaised = campaigns[i].dataValues.currentlyRaised;
                    const startupId =  campaigns[i].dataValues.startupId;
                    const campaignCache = cache;
                     
                    // console.log(campaignCache)
                    // if ( currentDateTime.isSame(campaignStartDateTime, 'second') && currentlyRaised >= campaignGoal ) {
                    if ( currentDateTime.isBetween(campaignStartDateTime, campaignEndDateTime, 'second') 
                        && currentlyRaised >= campaignGoal ) {
                        // check if cache if campaign is currently deploying sc
                        if (!campaignCache.has(startupId)) { // cache do not have campaign
                            const obj = {
                                campaign : campaigns[i],
                                deployStatus : "Queued" // inProgress
                            }
                            campaignCache.set(startupId, obj);
                        } else { // cache has campaign 
                            // check deployStatus and check whether we can deploy this sc
                            const startup = campaignCache.get(startupId) // current startup
                        
                            if (startup.deployStatus === "Queued" && deployCount > 0) {
                                startup.deployStatus = "inProgress"
                                campaignCache.set(startupId, startup)
                                deployCount--
                                
                                // deploy Smart Contracts
                                console.log(`[Smart Contracts] Deploying startupId:${startupId}'s smart contracts`);
                                // post request to admin deploy sc route
                                const deploySCurl = 'http://localhost:8080/admin/sc/deploy/' + startupId; 
                                const data = {
                                    "coinName": "deloba",
                                    "coinSymbol":"D",
                                    "coinDecimals": 2,
                                    "coinSupply":100
                                };
                                const headers = {
                                    "Content-Type": "application/json"
                                };
                                try {
                                    const deployStatus = await axios.post(deploySCurl, data, { headers : headers })
                                    if (deployStatus.status === 200) {
                                        console.log(deployStatus.data)
                                        // Update Campaign Model Fields
                                        updates = {
                                            campaignAddr : deployStatus.data.milestoneSCaddress,
                                            fungibleTokenAddr : deployStatus.data.fungibleTokenSCaddress,
                                            SCdeployedStatus : true
                                        }
                                        const updateStatus = await campaignController.cronUpdate(updates, startupId)
                                        console.log('updatestatus ',updateStatus);
                                        campaignCache.delete(startupId);
                                    }
                                    else {
                                        console.log(`[ERROR] Failed to deploy Smart Contracts for startupId=${startupId} with error code: ${deployStatus.status}`);
                                    }
                                } catch (error) {
                                    console.log('errorrr >>>>', error)
                                }
                                deployCount++ 
                            }   
                        } 
                    } 
                    // else if (failedFundraising) {}
                    // going thru each campaign

                    /* TODO: How to handle expired campaigns? 
                    1. Failed Fundraising.
                    2. Failed Milestones.
                    */
                    // Failed Fundraising.
                    
                }
            }
            // console.log(campaigns)
            // return campaigns
        } catch (error) {
            throw error
        }
    }
}