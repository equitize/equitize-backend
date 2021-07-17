const campaignController = require("../../db/controllers/campaign.controller");
const axios = require("axios");
const moment = require("moment");
const cache = require("./cache");
const dbConstants = require("../../db/constants/constants");
const campaignService = require("../../db/services/campaign.service");
const auth0Controller = require("../../auth0/controllers/backend.controller");

var deployCount = 1;

module.exports = {
    testFunction : () => {
        console.log('runnning every 5 seconds')
    },
    checkCampaignGoal : async () => {
        try {
            const campaignCache = cache;
            if (deployCount === 0) { 
                return 
            }
            
            const attributes = {
                attributes: ['startDate', 'endDate', 'goal', 'currentlyRaised', 'startupId']
            }
            const conditions = {
                where : { SCdeployedStatus : false , campaignStatus : dbConstants.campaign.status.NONLIVE }
            }
            const campaigns = await campaignController.cronFindAll(conditions, attributes) // campaigns that are not yet live
            
            if (campaigns.length != 0) { // no non live campaigns
                for (let i=0; i < campaigns.length; i++) {
                    
                    const campaignStartDateTime = moment(campaigns[i].dataValues.startDate);
                    const campaignEndDateTime = moment(campaigns[i].dataValues.endDate);
                    const currentDateTime = moment();
                    const campaignGoal = campaigns[i].dataValues.goal;
                    const currentlyRaised = campaigns[i].dataValues.currentlyRaised;
                    const startupId =  campaigns[i].dataValues.startupId;
                
                    if ( currentDateTime.isBetween(campaignStartDateTime, campaignEndDateTime, 'second') 
                        && currentlyRaised >= campaignGoal ) {
                        
                        const update = {
                            campaignStatus : dbConstants.campaign.status.LIVE,
                            }
                        const updateStatus = await campaignController.cronUpdate(update, startupId)
                        // check if cache if campaign is currently deploying sc
                        if (!campaignCache.has(startupId)) { // cache do not have non live campaign
                            const obj = {
                                campaign : campaigns[i],
                                deployStatus : "Queued" // inProgress
                            }
                            campaignCache.set(startupId, obj);
                        }
                    } 
                    else if (currentDateTime.isAfter(campaignEndDateTime, 'seconds')) { // campaign expired
                        // campaignGoal not reached
                        // update campaignStatus -> failedFundraising
                        const updates = { campaignStatus : dbConstants.campaign.status.FAILED.FUNDRAISING }
                        await campaignService.update(updates, startupId)
                    }
                
                    /* TODO: How to trigger failed Milestones? 
                    1. Failed Milestones.
                    */
                }
            } else if (campaignCache.size !== 0) {
                campaignCache.forEach(async function (value, key) {
                    const startup = value
                    const startupId = key
                    if (startup.deployStatus === "Queued" && deployCount > 0) {
                        startup.deployStatus = "inProgress"
                        campaignCache.set(startupId, startup)
                        deployCount--
                        // get management token
                        var adminToken = ''
                        const url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;
                        var data = {
                            "grant_type": "http://auth0.com/oauth/grant-type/password-realm",
                            "client_id": process.env.AUTH0_FRONTEND_CLIENTID,
                            "audience": process.env.AUTH0_AUDIENCE,
                            "username": "admin@equitize.xyz",
                            "password": "Password123!....",
                            "realm": "Username-Password-Authentication"
                        };
                        var headers = {
                            "Content-Type": "application/json",
                            "authorization": `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`
                        };
                        const accessToken = await axios.post(url, data, { headers : headers });
                        
                        if ( accessToken.status === 200) { 
                            adminToken = accessToken.data.access_token
                        }
                        else if ( accessToken.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
                        else {
                            throw createHttpError[500];
                        }
                        // deploy Smart Contracts
                        console.log(`[Smart Contracts] Deploying startupId:${startupId}'s smart contracts`);
                        // post request to admin deploy sc route
                        const deploySCurl = 'http://localhost:8080/admin/sc/deploy/' + startupId; 
                        data = {
                            "coinName": "deloba",
                            "coinSymbol":"D",
                            "coinDecimals": 2,
                            "coinSupply":100
                        };
                        headers = {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${adminToken}`
                        };
                        try {
                            const deployStatus = await axios.post(deploySCurl, data, { headers : headers })
                            if (deployStatus.status === 200) {
                                // Update Campaign Model Fields
                                updates = {
                                    campaignAddr : deployStatus.data.milestoneSCaddress,
                                    fungibleTokenAddr : deployStatus.data.fungibleTokenSCaddress,
                                    SCdeployedStatus : true,
                                    campaignStatus : dbConstants.campaign.status.SUCCESSFUL
                                }
                                const updateStatus = await campaignController.cronUpdate(updates, startupId)
                                console.log('updatestatus ',updateStatus);
                                campaignCache.delete(startupId);
                            }
                            else {
                                console.log(`[ERROR] Failed to deploy Smart Contracts for startupId=${startupId} with error code: ${deployStatus.status}`);
                            }
                        } catch (error) {
                            // TODO: morgan log sc deployment errors. 
                            console.log('errorrr >>>>', error)
                        };
                        deployCount++ 
                    }   
                })
                    
                    
                    
                   
            }
            // console.log(campaigns)
            // return campaigns
        } catch (error) {
            throw error
        }
    }
}