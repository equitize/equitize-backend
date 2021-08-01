const campaignController = require("../../db/controllers/campaign.controller");
const axios = require("axios");
const moment = require("moment");
const cache = require("./cache");
const dbConstants = require("../../db/constants/constants");
const campaignService = require("../../db/services/campaign.service");
const milestonePartController = require("../../db/controllers/milestonePart.controller");
const CrowdfundingController = require("../../V2SmartContracts/controllers/crowdfunding.controller");
const auth0Controller = require("../../auth0/controllers/backend.controller");

var deployCount = 1;

module.exports = {
    testFunction : () => {
        console.log('runnning every 5 seconds')
        // console.log(moment('2021-07-20T18:06:30+08:00'))
        // console.log(moment())
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
            if (campaigns.length !== 0) { // non live campaigns exists
                for (let i=0; i < campaigns.length; i++) {
                    
                    const campaignStartDateTime = moment(campaigns[i].dataValues.startDate);
                    const campaignEndDateTime = moment(campaigns[i].dataValues.endDate);
                    const currentDateTime = moment();
                    const campaignGoal = campaigns[i].dataValues.goal;
                    const currentlyRaised = campaigns[i].dataValues.currentlyRaised;
                    const startupId =  campaigns[i].dataValues.startupId;

                    if (currentDateTime.isBetween(campaignStartDateTime, campaignEndDateTime, 'second')) {
                        const update = {
                            campaignStatus : dbConstants.campaign.status.LIVE,
                            }
                        const updateStatus = await campaignController.cronUpdate(update, startupId)
                    } else if (currentDateTime.isAfter(campaignEndDateTime, 'seconds')) { // campaign expired
                        // campaignGoal not reached
                        // update campaignStatus -> failedFundraising
                        const updates = { campaignStatus : dbConstants.campaign.status.FAILED.FUNDRAISING }
                        await campaignService.update(updates, startupId)
                    }

                    if ( currentDateTime.isBetween(campaignStartDateTime, campaignEndDateTime, 'second') 
                        && currentlyRaised >= campaignGoal ) {
                    
                        // check if cache if campaign is currently deploying sc
                        if (!campaignCache.has(startupId)) { // cache do not have non live campaign
                            const obj = {
                                campaign : campaigns[i],
                                deployStatus : "Queued" // inProgress
                            }
                            campaignCache.set(startupId, obj);
                        }
                    } 
                    
                    /* TODO: How to trigger failed Milestones? 
                    1. Failed Milestones.
                    */
                }
            } 
            if (campaignCache.size !== 0) {
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
                            "username": process.env.AUTH0_ADMIN_USERNAME,
                            "password": process.env.AUTH0_ADMIN_PWD,
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
    },
    checkCampaignGoalV2 : async () => {
        // meant to integrate for blockchain v2
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
            if (campaigns.length !== 0) { // non live campaigns exists
                for (let i=0; i < campaigns.length; i++) {
                    
                    const campaignStartDateTime = moment(campaigns[i].dataValues.startDate);
                    const campaignEndDateTime = moment(campaigns[i].dataValues.endDate);
                    const currentDateTime = moment();
                    const campaignGoal = campaigns[i].dataValues.goal;
                    const currentlyRaised = campaigns[i].dataValues.currentlyRaised;
                    const startupId =  campaigns[i].dataValues.startupId;

                    if (currentDateTime.isBetween(campaignStartDateTime, campaignEndDateTime, 'second')) {
                        const update = {
                            campaignStatus : dbConstants.campaign.status.LIVE,
                        }
                        const updateStatus = await campaignController.cronUpdate(update, startupId)
                    } else if (currentDateTime.isAfter(campaignEndDateTime, 'seconds')) { // campaign expired
                        console.log(`startupid=${startupId} campaign expired.`)
                        const updates = { campaignStatus : dbConstants.campaign.status.FAILED.FUNDRAISING }
                        await campaignService.update(updates, startupId)
                        // get admin token
                        var adminToken = ''
                        const url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;
                        var data = {
                            "grant_type": "http://auth0.com/oauth/grant-type/password-realm",
                            "client_id": process.env.AUTH0_FRONTEND_CLIENTID,
                            "audience": process.env.AUTH0_AUDIENCE,
                            "username": process.env.AUTH0_ADMIN_USERNAME,
                            "password": process.env.AUTH0_ADMIN_PWD,
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
                        const setdeadlineURL = "http://localhost:8080/admin/sc2/CFsetCFdeadlineTrue"
                        data = {
                            "privateKey" : process.env.SC2_STARTUP_PRIVATE_KEY
                        }
                        headers = {
                            "Content-Type": "application/json",
                            "authorization": `Bearer ${adminToken}`
                        }
                        const setDeadlineStatus = await axios.post(setdeadlineURL, data, { headers : headers })
                        if ( setDeadlineStatus.status === 200) { 
                            console.log(`Succesfully set deadline=True for expired Campaign for startupId=${startupId}`);
                        }
                        else if ( setDeadlineStatus.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
                        else {
                            throw createHttpError[500];
                        }
                        if (currentlyRaised >= campaignGoal) {
                            // issue equity token to retail.
                            const CFcrowdfundingGetFundsURL = "http://localhost:8080/admin/sc2/CFcrowdfundingGetFunds"
                            const CFcrowdfundingGetFundsStatus = await axios.post(CFcrowdfundingGetFundsURL, data, { headers : headers })
                            if ( CFcrowdfundingGetFundsStatus.status === 200) { 
                                console.log(`Succesfully return funds to retail investors for campaign associated with startupId=${startupId}`);
                            }
                            else if ( CFcrowdfundingGetFundsStatus.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
                            else {
                                throw createHttpError[500];
                            }
                        } else {
                            const CFcrowdfundingFailClaimbackURL = "http://localhost:8080/admin/sc2/CFcrowdfundingFailClaimback"
                            const CFcrowdfundingFailClaimbackStatus = await axios.post(CFcrowdfundingFailClaimbackURL, data, { headers : headers })
                            if ( CFcrowdfundingFailClaimbackStatus.status === 200) { 
                                console.log(`Succesfully return funds to retail investors for campaign associated with startupId=${startupId}`);
                            }
                            else if ( CFcrowdfundingFailClaimbackStatus.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
                            else {
                                throw createHttpError[500];
                            }
                        }

                        
                    }

                    if ( currentDateTime.isBetween(campaignStartDateTime, campaignEndDateTime, 'second') 
                        && currentlyRaised >= campaignGoal ) {
                    
                        // check if cache if campaign is currently deploying sc
                        if (!campaignCache.has(startupId)) { // cache do not have non live campaign
                            const obj = {
                                campaign : campaigns[i],
                                deployStatus : "Queued" // inProgress
                            }
                            campaignCache.set(startupId, obj);
                        }
                    } 
                    
                    /* TODO: How to trigger failed Milestones? 
                    1. Failed Milestones.
                    */
                }
            } 
            if (campaignCache.size !== 0) {
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
                            "username": process.env.AUTH0_ADMIN_USERNAME,
                            "password": process.env.AUTH0_ADMIN_PWD,
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
                        // deploy Smart Contracts: Equity Token
                        console.log(`[Smart Contracts] Deploying startupId:${startupId}'s Smart Contract`);
                        // post request to admin deploy sc route
                        const deployV2SCurl = 'http://localhost:8080/admin/sc2/deploy/' + startupId; 
                        data = {
                            "coinName": "Equitize",
                            "coinSupply":30,
                            "coinSymbol":"E",
                            "coinDecimals":0,
                            "amount": 30, // equity tokens (to be dynamically loaded in the future)
                            "privateKey": process.env.SC2_STARTUP_PRIVATE_KEY
                        };
                        headers = {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${adminToken}`
                        };
                        try {
                            const deployStatus = await axios.post(deployV2SCurl, data, { headers : headers })
                            if (deployStatus.status === 200) {
                                console.log("deployStatus: ", deployStatus)
                                // Update Campaign Model Fields
                                updates = {
                                    campaignAddr : deployStatus.data.crowdfundingSCaddress,
                                    fungibleTokenAddr : deployStatus.data.equityTokenSCaddress,
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
            console.log(error)
            throw error
        }
    },
}