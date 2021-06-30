const retailInvestorsController = require("../controllers/retailInvestors.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller");
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
router.post("/", 
// auth0Controller.getMgtToken, 
// auth0RegController.createAccount, 
// auth0RegController.retailInvestors,
retailInvestorsController.create);

// Retrieve all retailInv
router.get("/", retailInvestorsController.findAll);

// Retrieve a single retailInv with id
router.get("/:id", retailInvestorsController.findOne);

// Update a retailInv with id
router.put("/:id", retailInvestorsController.update);

// Delete a retailInv with id
router.delete("/:id", retailInvestorsController.delete);

// Delete all retailInv
router.delete("/", retailInvestorsController.deleteAll);

// Retrieve retailInv by email
router.get("/email/:emailAddress", retailInvestorsController.findViaEmail);
//http://localhost:8080/api/db/retailInvestors/email/kenny@mail.xyz

// Associate industries to retail investor
router.post("/industries/addIndustries/", industryController.create);

// Associate industries to retail investor
router.get("/recommender/:id", industryController.getRetailInvestor, recommenderController.getAndSortStartups);

// Get industries associated with retailinvestorId
router.get("/industries/getIndustries/:id", industryController.getRetailInvestor, industryController.getIndustries);

// Pledge amount to campaign
router.put("/campaign/pledge/:startupId", 
campaignController.getStartup, 
campaignController.pledgeAmount,
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