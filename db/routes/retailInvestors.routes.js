const retailInvestorsController = require("../controllers/retailInvestors.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller");
const auth0LogController = require("../../auth0/controllers/login.controller");
const startupController = require("../controllers/startup.controller");
const industryController = require("../controllers/industry.controller");
const recommenderController = require("../controllers/recommender.controller");
const campaignController = require("../controllers/campaign.controller");
const milestonePartController = require("../controllers/milestonePart.controller");
const zilliqaController = require("../../smartContracts/controllers/zilliqa.controller");
const milestoneSCController = require("../../smartContracts/controllers/milestoneSC.controller");
const fungibleTokenSCController = require("../../smartContracts/controllers/fungibleTokenSC.controller");

const router = require("express").Router();


// Create a new retailInv
if (process.env.NODE_ENV == 'test') {
    router.post("/", 
        retailInvestorsController.create,
    );
} else {
    router.post("/", 
        auth0Controller.getMgtToken, 
        auth0RegController.createAccount, 
        auth0RegController.retailInvestors,
        retailInvestorsController.create,
        auth0LogController.createRetailInvLogin,
    );
    // Login (TODO: include jwt check before db access)
    // no need kyc verferification
    router.post("/login", auth0LogController.retailInvLogin, retailInvestorsController.findIDByEmail)
}

// Retrieve all retailInv
// no need kyc verferification
router.get("/", retailInvestorsController.findAll);

// Retrieve a single retailInv with id
// no need kyc verferification
router.get("/:id", retailInvestorsController.findOne);

// Update a retailInv with id
// no need kyc verferification
router.put("/:id", retailInvestorsController.update);

// Delete a retailInv with id
// no need kyc verferification
router.delete("/:id", retailInvestorsController.delete);

// Delete all retailInv
// move to admin 
router.delete("/", retailInvestorsController.deleteAll);

// Retrieve retailInv by email
// no need kyc verferification
router.get("/email/:emailAddress", retailInvestorsController.findViaEmail);
//http://localhost:8080/api/db/retailInvestors/email/kenny@mail.xyz

// Associate industries to retail investor
// no need kyc verferification
router.post("/industries/addIndustries/", industryController.create);

// Associate industries to retail investor
// need kyc verferification
router.get("/recommender/:id", industryController.getRetailInvestor, recommenderController.getAndSortStartups);

// Get industries associated with retailinvestorId
// no need kyc verferification
router.get("/industries/getIndustries/:id", industryController.getRetailInvestor, industryController.getIndustries);

// Pledge amount to campaign
// need kyc verferification
router.put("/campaign/pledge/:startupId", 
campaignController.getStartup, 
campaignController.pledgeAmount,
retailInvestorsController.addCampaign
// add in middlewares that will deploy SC
// milestonePartController.getStartup,
// zilliqaController.getMilestone,
// zilliqaController.getCampaigns,
// zilliqaController.getZilAmt,
// milestoneSCController.deploy,
// fungibleTokenSCController.deploy,
// retailInvestorsController.checkSCstatus
);

module.exports = router;