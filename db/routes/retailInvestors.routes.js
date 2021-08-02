const retailInvestorsController = require("../controllers/retailInvestors.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller");
const auth0LogController = require("../../auth0/controllers/login.controller");
const industryController = require("../controllers/industry.controller");
const recommenderController = require("../controllers/recommender.controller");
const campaignController = require("../controllers/campaign.controller");
const jwtController = require("../../auth0/controllers/jwt.controller");
const startupController = require("../controllers/startup.controller");
const CloudStorageController = require("../../cloudStorage/controllers/cloudStorage.controller.js");


const router = require("express").Router();


// Create a new retailInv
if (process.env.NODE_ENV == 'test-nope') {
    router.post("/", 
        retailInvestorsController.create,
    );
    router.post("/testOAuth", 
        auth0Controller.getMgtToken, 
        auth0RegController.createAccount, 
        auth0RegController.retailInvestors,
        auth0Controller.addPerms,
        retailInvestorsController.create,
        auth0LogController.createRetailInvLogin
    );
} else {
    router.post("/", 
        auth0Controller.getMgtToken, 
        auth0RegController.createAccount, 
        auth0RegController.retailInvestors,
        auth0Controller.addPerms,
        retailInvestorsController.create,
        auth0LogController.createRetailInvLogin,
    );

}

// Login
// no need kyc verferification
router.post("/login", auth0LogController.retailInvLogin, retailInvestorsController.findIDByEmail)

// Retrieve all retailInv
// no need kyc verferification
// router.get("/", jwtController.authorizeAccessToken, jwtController.checkretailKYCUnverified, auth0Controller.checkID, retailInvestorsController.findAll);

// Retrieve a single retailInv with id
// no need kyc verferification
router.get("/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCUnverified, auth0Controller.checkID, retailInvestorsController.findOne);

// Update a retailInv with id
// no need kyc verferification
router.put("/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCUnverified, auth0Controller.checkID, retailInvestorsController.update);

// Delete a retailInv with id
// no need kyc verferification
router.delete("/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCUnverified, auth0Controller.checkID, retailInvestorsController.delete);

// Retrieve retailInv by email
// no need kyc verferification
router.get("/email/:emailAddress/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCUnverified, auth0Controller.checkID, retailInvestorsController.findViaEmail);
//http://localhost:8080/api/db/retailInvestors/email/kenny@mail.xyz

// Associate industries to retail investor
// no need kyc verferification
router.post("/industries/addIndustries/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCUnverified, auth0Controller.checkID, industryController.create);

// Associate industries to retail investor
// need kyc verferification
router.get("/recommender/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCverified, auth0Controller.checkID, industryController.getRetailInvestor, recommenderController.getAndSortStartups);

// Get industries associated with retailinvestorId
// no need kyc verferification
router.get("/industries/getIndustries/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCUnverified, auth0Controller.checkID, industryController.getRetailInvestor, industryController.getIndustries);

// Pledge amount to campaign
// need kyc verferification
router.put("/campaign/pledge/:startupId/:id", 
jwtController.authorizeAccessToken, jwtController.checkretailKYCverified, auth0Controller.checkID, campaignController.getStartup, campaignController.pledgeAmount, retailInvestorsController.addCampaign);

// get startup by Id
router.get("/getStartup/:startupId/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCverified, auth0Controller.checkID, startupController.findOne);
// need startupId and retailinv id

// get signedURL resource of startup with original filename
router.get("/getSignedURLPlus/:fileType/:startupId/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCverified, auth0Controller.checkID, startupController.getItemIdentifierWithName, CloudStorageController.getSignedUrlWithName)

// get signedURL resource (capTable) of startup without original filename 
router.get("/getSignedURL/:fileType/:startupId/:id", jwtController.authorizeAccessToken, jwtController.checkretailKYCverified, auth0Controller.checkID, startupController.getItemIdentifier, CloudStorageController.getSignedURL);

module.exports = router;