const startupController = require("../controllers/startup.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const campaignController = require("../controllers/campaign.controller");
const milestonePartController = require("../controllers/milestonePart.controller");
const zilliqaController = require("../../smartContracts/controllers/zilliqa.controller");
const milestoneSCController = require("../../smartContracts/controllers/milestoneSC.controller");
const fungibleTokenSCController = require("../../smartContracts/controllers/fungibleTokenSC.controller");
const retailInvestorsController = require("../controllers/retailInvestors.controller");
const retailInvLogController = require("../controllers/retailInvLog.controller");
const router = require("express").Router();

// Delete all startups
router.delete("/", startupController.deleteAll);

// Retrieve Startup by name
router.get("/companyName/:companyName", startupController.findViaName);

// Retrieve Startup by email
router.get("/email/:email", startupController.findViaEmail);

// Set campaign with only companyID
// maybe use for admin
router.post("/createCampaign/", campaignController.create);

// Retrieve a single Startup with id
router.get("/getStartup/:id", startupController.findOne);

// Retrieve all Startup
router.get("/", startupController.findAll);

// need a route to associate permission to a role
router.put("/perms/associate/", auth0Controller.addPerms)

// need a route to remove permission from a role

// get all campaigns
router.get("/campaign/getCampaigns", campaignController.findAll);

// deploy smart contracts
router.post("/sc/deploy/:startupId", 
milestonePartController.getStartup,
zilliqaController.getMilestone,
zilliqaController.getCampaigns,
zilliqaController.getZilAmt,
milestoneSCController.deploy,
fungibleTokenSCController.deploy,
zilliqaController.checkSCstatus);

// drop all auth0 users
router.post("/auth0/dropUsers", auth0Controller.delAllUsers);

// get all retailInvLogs (Request Logs)
router.get("/logs/retailInvLogs", retailInvLogController.findAll);

module.exports = router; 