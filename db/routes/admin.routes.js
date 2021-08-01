const startupController = require("../controllers/startup.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller");
const auth0LoginController = require("../../auth0/controllers/login.controller");
const campaignController = require("../controllers/campaign.controller");
const milestonePartController = require("../controllers/milestonePart.controller");
const zilliqaController = require("../../smartContracts/controllers/zilliqa.controller");
const zilliqaV2Controller = require("../../V2SmartContracts/controllers/zilliqaV2.controller");
const XSGDController = require("../../V2SmartContracts/controllers/xsgd.controller");
const ETController = require("../../V2SmartContracts/controllers/equityToken.Controller");
const CrowdfundingController = require("../../V2SmartContracts/controllers/crowdfunding.controller.js");
const milestoneSCController = require("../../smartContracts/controllers/milestoneSC.controller");
const fungibleTokenSCController = require("../../smartContracts/controllers/fungibleTokenSC.controller");
const retailInvestorsController = require("../controllers/retailInvestors.controller");
const retailInvLogController = require("../controllers/retailInvLog.controller");
const adminController = require("../controllers/admin.controller");
const commercialChampionController = require("../controllers/commercialChampion.controller.js");
const jwtController = require("../../auth0/controllers/jwt.controller");
const router = require("express").Router();

// Delete all startups
router.delete("/startups", jwtController.authorizeAccessToken, jwtController.checkAdmin, startupController.deleteAll);

// Delete all retailInv
router.delete("/retails", retailInvestorsController.deleteAll);

// Create admin
router.post("/create", auth0RegController.createAccount, auth0RegController.admin, auth0LoginController.createAdminLogin)

// Get admin token
router.post("/", auth0Controller.getAdminToken)

// Retrieve Startup by name
router.get("/companyName/:companyName", jwtController.authorizeAccessToken, jwtController.checkAdmin, startupController.findViaName);

// Retrieve Startup by email
router.get("/email/:email", jwtController.authorizeAccessToken, jwtController.checkAdmin, startupController.findViaEmail);

// Set campaign with only companyID
// maybe use for admin
router.post("/createCampaign/", jwtController.authorizeAccessToken, jwtController.checkAdmin, campaignController.create);

// Retrieve a single Startup with id
router.get("/getStartup/:startupId", jwtController.authorizeAccessToken, jwtController.checkAdmin, startupController.findOne);

// Retrieve all Startup
router.get("/getStartups", jwtController.authorizeAccessToken, jwtController.checkAdmin, startupController.findAll);

// need a route to associate permission to a role
router.put("/auth0/perms/add", jwtController.authorizeAccessToken, jwtController.checkAdmin, auth0Controller.getUserByEmail, auth0Controller.addPerms)

// remove perms
router.delete("/auth0/perms/delete", jwtController.authorizeAccessToken, jwtController.checkAdmin, auth0Controller.getUserByEmail, auth0Controller.removePerms)

// KYC unverified -> verified
router.post("/auth0/kyc/verified", jwtController.authorizeAccessToken, jwtController.checkAdmin, adminController.addKYCverifyFlag, auth0Controller.getUserByEmail, auth0Controller.removePerms, auth0Controller.addPerms, adminController.checkKYCverification)

// get all campaigns
router.get("/campaign/getCampaigns", jwtController.authorizeAccessToken, jwtController.checkAdmin, campaignController.findAll);

// Set commercialChampion 
// Should be moved to admin 
// need kyc verferification
router.post("/setCommercialChampion", jwtController.authorizeAccessToken, jwtController.checkAdmin, commercialChampionController.create);
// router.post("/setCommercialChampion", commercialChampionController.create);

// deploy v1 smart contracts
router.post("/sc/deploy/:startupId",
jwtController.authorizeAccessToken, jwtController.checkAdmin,
milestonePartController.getStartup,
zilliqaController.getMilestone,
zilliqaController.getCampaigns,
zilliqaController.getZilAmt,
milestoneSCController.deploy,
fungibleTokenSCController.deploy,
zilliqaController.checkSCstatus);

// drop all auth0 users
router.post("/auth0/dropUsers", jwtController.authorizeAccessToken, jwtController.checkAdmin, auth0Controller.delAllUsers);

// get all retail investors
router.get("/getRetailInvs", jwtController.authorizeAccessToken, jwtController.checkAdmin, retailInvestorsController.findAll);

// get all retailInvLogs (Request Logs)
router.get("/logs/retailInvLogs", jwtController.authorizeAccessToken, jwtController.checkAdmin, retailInvLogController.findAll);

// deploy v2 Blockchain XSGD Contract
router.post("/sc2/deployXSGD", jwtController.authorizeAccessToken, jwtController.checkAdmin, XSGDController.deploy);

// deploy v2 smart contracts (equity token and crowdfunding contract)
router.post("/sc2/deploy/:startupId", 
jwtController.authorizeAccessToken, jwtController.checkAdmin, 
ETController.deploy,
milestonePartController.getStartup,
zilliqaV2Controller.getMilestone,
zilliqaV2Controller.getCampaigns,
zilliqaV2Controller.getZilAmt,
CrowdfundingController.deploy,
CrowdfundingController.setCrowdfundingSCAddress,
ETController.transferBalanceToCF,
zilliqaV2Controller.checkSCstatus
)

// [TEST] v2 Blockchain XSGD Tx from XSGD SC to Retail Investor specified address
router.post("/sc2/transferXSGD", jwtController.authorizeAccessToken, jwtController.checkAdmin, XSGDController.transfer);

// set v2 cf sc deadline to true
router.post("/sc2/CFsetCFdeadlineTrue", jwtController.authorizeAccessToken, jwtController.checkAdmin, CrowdfundingController.setCrowdfundingDeadlineTrue);

// issue equity tokens to retail investors
router.post("/sc2/CFcrowdfundingGetFunds", jwtController.authorizeAccessToken, jwtController.checkAdmin, CrowdfundingController.crowdfundingGetFunds);

// v2 blockchain setMilestoneDeadlineTrue
router.post("/sc2/CFsetMilestoneDeadlineTrue", jwtController.authorizeAccessToken, jwtController.checkAdmin, CrowdfundingController.setMilestoneDeadlineTrue);

// release monies to startup
router.post("/sc2/CFfinishMilestoneOne", jwtController.authorizeAccessToken, jwtController.checkAdmin, CrowdfundingController.finishMilestoneOne);

// release xsgd to retail investor
router.post("/sc2/CFcrowdfundingFailClaimback", jwtController.authorizeAccessToken, jwtController.checkAdmin, CrowdfundingController.crowdfundingFailClaimback);

module.exports = router; 