const campaignController = require("../db/controllers/campaign.controller");
const axios = require("axios");
const moment = require("moment");

module.exports = {
    testFunction : () => {
        console.log('runnning every 5 seconds')
    },
    checkCampaignGoal : async () => {
        try {
            const attributes = {
                attributes: ['startDate', 'endDate', 'goal', 'currentlyRaised', 'startupId']
            }
            const campaigns = await campaignController.cronFindAll(attributes)
            if (campaigns.length != 0) {
                for (let i=0; i < campaigns.length; i++) {
                    
                    const campaignStartDateTime = moment(campaigns[i].dataValues.startDate);
                    const currentDateTime = moment();
                    const campaignGoal = campaigns[i].dataValues.goal;
                    const currentlyRaised = campaigns[i].dataValues.currentlyRaised;
                    const startupId =  campaigns[i].dataValues.startupId;
                    
                    if ( currentDateTime.isSame(campaignStartDateTime, 'second') && currentlyRaised >= campaignGoal ) { 
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
                        const deployStatus = await axios.post(deploySCurl, data, { headers : headers })
                        if (deployStatus.status === 200) {
                            console.log(deployStatus.data)
                            // Update Campaign Model Fields
                            updates = {
                                campaignAddr : deployStatus.data.milestoneSCaddress,
                                fungibleTokenAddr : deployStatus.data.fungibleTokenSCaddress
                            }
                            const updateStatus = await campaignController.cronUpdate(updates, startupId)
                            console.log('updatestatus ',updateStatus)
                        }
                        else {
                            console.log(`[ERROR] Failed to deploy Smart Contracts for startupId=${startupId} with error code: ${deployStatus.status}`);
                        }
                    }
                    

                    // TODO: How to handle expired campaigns? 
                }
            }
            // console.log(campaigns)
            // return campaigns
        } catch (error) {
            throw error
        }
    }
}