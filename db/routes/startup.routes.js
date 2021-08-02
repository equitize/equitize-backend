const startupController = require("../controllers/startup.controller.js");
const campaignController = require("../controllers/campaign.controller.js");
const commercialChampionController = require("../controllers/commercialChampion.controller.js");
const milestonePartController = require("../controllers/milestonePart.controller");
const industryController = require("../controllers/industry.controller");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller.js");
const auth0LoginController = require("../../auth0/controllers/login.controller");
const CloudStorageController = require("../../cloudStorage/controllers/cloudStorage.controller.js");
const jwtController = require("../../auth0/controllers/jwt.controller");
const router = require("express").Router();


// Create a new startup
if (process.env.NODE_ENV == 'test-nope') {
    router.post("/", 
        startupController.create,
    );
    router.post("/testOAuth", 
        auth0Controller.getMgtToken,
        auth0RegController.createAccount,
        auth0RegController.startup,
        auth0Controller.addPerms,
        startupController.create,
        auth0LoginController.createStartupLogin
    );
} else {
    router.post("/", 
        auth0Controller.getMgtToken,
        auth0RegController.createAccount,
        auth0RegController.startup,
        auth0Controller.addPerms,
        startupController.create,
        auth0LoginController.createStartupLogin
    );  
}

// Login 
router.post("/login", auth0LoginController.startupLogin, startupController.findOneByEmail);

// Update a Startup with id
// no need kyc verferification
router.put("/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, startupController.update);

// Delete a Startup with id
// no need kyc verferification
router.delete("/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, startupController.delete);

// upload video
// no need kyc verferification
router.put("/video/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, CloudStorageController.uploadVideo, startupController.update);

// upload pitchdeck
// no need kyc verferification
router.put("/pitchDeck/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, CloudStorageController.uploadPitchDeck, startupController.update);

// Get SignedURL & original file name for limited access on resource (pitchDeck and video)
// no need kyc verferification
router.get("/getSignedURLPlus/:fileType/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverifiedretailInvVerified, auth0Controller.checkID, startupController.getItemIdentifierWithName, CloudStorageController.getSignedUrlWithName)

// Convert CapTable to live Link via CloudStorage
// Update captable field to to link in db. 
// no need kyc verferification
router.put("/capTable/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, CloudStorageController.uploadCapTable, startupController.update);

// Get SignedURL for limited access on resource (capTable)
// no need kyc verferification
router.get("/getSignedURL/:fileType/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverifiedretailInvVerified, auth0Controller.checkID, startupController.getItemIdentifier, CloudStorageController.getSignedURL);

// Convert acraDocuments to live Link via CloudStorage
// Update Startup's acraDocuments field to to link in db. 
// no need kyc verferification
router.put("/acraDocuments/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, CloudStorageController.uploadAcraDocuments, startupController.update);

// Convert bankInfo to live Link via CloudStorage
// Update Startup's bankInfo field to to link in db. 
// no need kyc verferification
router.put("/bankInfo/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, CloudStorageController.uploadBankInfo, startupController.update);

// Convert idProof to live Link via CloudStorage
// Update Startup's idProof field to to link in db. 
// no need kyc verferification
router.put("/idProof/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, CloudStorageController.uploadIdProof, startupController.update);

// Convert profilePhoto to live Link via CloudStorage
// Update Startup's profilePhoto field to to link in db. 
// no need kyc verferification
router.put("/profilePhoto/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, CloudStorageController.uploadProfilePhoto, startupController.update);

// Retrieve Startup by name
router.get("/companyName/:companyName/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCverified, auth0Controller.checkID, startupController.findViaName);
//http://localhost:8080/api/db/startup/companyName/equitize

// Retrieve Startup by email
router.get("/email/:email/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCverified, auth0Controller.checkID, startupController.findViaEmail);
//http://localhost:8080/api/db/startup/companyName/equitize

// Update Campaign Fields
// middleware first creates exists if campaign doesn't already exists
// no need kyc verferification
router.put("/campaign/update/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, campaignController.checkExists, campaignController.update);

// Get milestone associated with startupId
// no need kyc verferification
router.get("/milestone/getMilestone/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, milestonePartController.getStartup, milestonePartController.getMilestone)

// create milestone part
// no need kyc verferification
router.post("/milestone/addPart/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, milestonePartController.create)

// Delete all milestones associated with startupId
// no need kyc verferification
router.delete("/milestone/deleteMilestone/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, milestonePartController.delete);

// Delete milestone part associated with startupId
// no need kyc verferification
router.delete("/milestone/deletePart/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, milestonePartController.deletePart);

// Associate industries to startup
// no need kyc verferification
router.post("/industries/addIndustries/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, industryController.create);


// Get campaign
// router.get("/getCampaign/:companyId", campaignController.findViaCompanyId);

// Get commercialChampion
// need kyc verferification
router.get("/getCommercialChampion/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCverified, auth0Controller.checkID, commercialChampionController.findViaStartupId);

// Retrieve a single Startup with id
// no need kyc verferification
router.get("/:startupId", jwtController.authorizeAccessToken, jwtController.checkStartupKYCUnverified, auth0Controller.checkID, startupController.findOne);

// Retrieve all Startup
// move to admin
router.get("/", jwtController.authorizeAccessToken, jwtController.checkStartupKYCverified, startupController.findAll);

module.exports = router;
