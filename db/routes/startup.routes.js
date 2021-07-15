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


// Create a new retailInv
if (process.env.NODE_ENV == 'test') {
    router.post("/", 
        startupController.create,
    );
    router.post("/testOAuth", 
        auth0Controller.getMgtToken,
        auth0RegController.createAccount,
        auth0RegController.startup,
        startupController.create,
        auth0LoginController.startup
    );
} else {
    router.post("/", 
        auth0Controller.getMgtToken,
        auth0RegController.createAccount,
        auth0RegController.startup,
        startupController.create,
        auth0LoginController.createStartupLogin
    );
    
}

// Login 
router.post("/login", auth0LoginController.startupLogin, startupController.findOneByEmail);

// Update a Startup with id
// no need kyc verferification
router.put("/:startupId", startupController.update);

// Delete a Startup with id
// no need kyc verferification
router.delete("/:startupId", startupController.delete);

// upload video
// no need kyc verferification
router.put("/video/:startupId", CloudStorageController.uploadVideo, startupController.update);

// upload pitchdeck
// no need kyc verferification
router.put("/pitchDeck/:startupId",CloudStorageController.uploadPitchDeck, startupController.update);

// Get SignedURL & original file name for limited access on resource (pitchDeck and video)
// no need kyc verferification
router.get("/getSignedURLPlus/:fileType/:startupId", startupController.getItemIdentifierWithName, CloudStorageController.getSignedUrlWithName)

// Convert CapTable to live Link via CloudStorage
// Update captable field to to link in db. 
// no need kyc verferification
router.put("/capTable/:startupId", CloudStorageController.uploadCapTable, startupController.update);

// Get SignedURL for limited access on resource (capTable)
// no need kyc verferification
router.get("/getSignedURL/:fileType/:startupId", startupController.getItemIdentifier, CloudStorageController.getSignedURL);

// Convert acraDocuments to live Link via CloudStorage
// Update Startup's acraDocuments field to to link in db. 
// no need kyc verferification
router.put("/acraDocuments/:startupId", CloudStorageController.uploadAcraDocuments, startupController.update);

// Get SignedURL for limited access on resource (capTable)
// no need kyc verferification
router.get("/acraDocuments/:startupId", startupController.getItemIdentifier, CloudStorageController.getSignedURL);

// Convert bankInfo to live Link via CloudStorage
// Update Startup's bankInfo field to to link in db. 
// no need kyc verferification
router.put("/bankInfo/:startupId", CloudStorageController.uploadBankInfo, startupController.update);

// Get SignedURL for limited access on resource (bankInfo)
// no need kyc verferification
router.get("/bankInfo/:startupId", startupController.getItemIdentifier, CloudStorageController.getSignedURL);

// Convert idProof to live Link via CloudStorage
// Update Startup's idProof field to to link in db. 
// no need kyc verferification
router.put("/idProof/:startupId", CloudStorageController.uploadIdProof, startupController.update);

// Get SignedURL for limited access on resource (idProof)
// no need kyc verferification
router.get("/idProof/:startupId", startupController.getItemIdentifier, CloudStorageController.getSignedURL);

// Convert profilePhoto to live Link via CloudStorage
// Update Startup's profilePhoto field to to link in db. 
// no need kyc verferification
router.put("/profilePhoto/:startupId", CloudStorageController.uploadProfilePhoto, startupController.update);


// Get SignedURL for limited access on resource (profilePhoto)
// no need kyc verferification
router.get("/profilePhoto/:startupId", startupController.getItemIdentifier, CloudStorageController.getSignedURL);


// not sure if this only needs admin route
// Retrieve Startup by name
router.get("/companyName/:companyName", startupController.findViaName);
// router.get("/companyName/:companyName", startup.findViaName);
//http://localhost:8080/api/db/startup/companyName/equitize

// Retrieve Startup by email
router.get("/email/:email", startupController.findViaEmail);
//http://localhost:8080/api/db/startup/companyName/equitize

// Update Campaign Fields
// middleware first creates exists if campaign doesn't already exists
// no need kyc verferification
router.put("/campaign/update/:startupId", campaignController.checkExists, campaignController.update);

// Set commercialChampion 
// Should be moved to admin 
// need kyc verferification
router.post("/setCommercialChampion/", commercialChampionController.create);

// Get milestone associated with startupId
// no need kyc verferification
router.get("/milestone/getMilestone/:startupId", milestonePartController.getStartup, milestonePartController.getMilestone)

// create milestone part
// no need kyc verferification
router.post("/milestone/addPart/", milestonePartController.create)

// Delete all milestones associated with startupId
// no need kyc verferification
router.delete("/milestone/deleteMilestone/", milestonePartController.delete);

// Delete milestone part associated with startupId
// no need kyc verferification
router.delete("/milestone/deletePart/:startupId", milestonePartController.deletePart);

// Associate industries to startup
// no need kyc verferification
router.post("/industries/addIndustries/", industryController.create);


// Get campaign
// router.get("/getCampaign/:companyId", campaignController.findViaCompanyId);

// Get commercialChampion
// need kyc verferification
router.get("/getCommercialChampion/:startupId", commercialChampionController.findViaStartupId);

// Retrieve a single Startup with id
// no need kyc verferification
router.get("/:startupId", startupController.findOne);

// Retrieve all Startup
// move to admin
router.get("/", startupController.findAll);

module.exports = router;
