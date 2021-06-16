const startupController = require("../controllers/startup.controller.js");
const campaignController = require("../controllers/campaign.controller.js");
const commercialChampionController = require("../controllers/commercialChampion.controller.js");
const milestonePartController = require("../controllers/milestonePart.controller");
const industryController = require("../controllers/industry.controller");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller.js");
const CloudStorageController = require("../../cloudStorage/controllers/cloudStorage.controller.js");
const jwtController = require("../../auth0/controllers/jwt.controller");
const router = require("express").Router();


// Create a new Startup
router.post("/",
    // auth0Controller.getMgtToken,
    // auth0RegController.createAccount,
    // auth0RegController.startup,
    startupController.create
);

// Update a Startup with id
// no need kyc verferification
// router.put("/:id", startupController.update);

// Delete a Startup with id
// no need kyc verferification
router.delete("/:id", startupController.delete);

// upload video
router.put("/video/:id", CloudStorageController.uploadVideo, startupController.update);

// Get SignedURL for limited access on resource (video)
router.get("/video/:id", startupController.getItemIdentifier, CloudStorageController.getSignedURL)

// Convert Pitch Deck pdf to live Link via CloudStorage
// Update Startup's pitch deck field to to link in db.
router.put("/pitchDeck/:id", CloudStorageController.uploadPitchDeck, startupController.update);

// Get SignedURL for limited access on resource (pitchDeck)
router.get("/pitchDeck/:id", startupController.getItemIdentifier, CloudStorageController.getSignedURL)

// Convert CapTable to live Link via CloudStorage
// Update Startup's video field to to link in db. 
router.put("/capTable/:id", CloudStorageController.uploadCapTable, startupController.update);

// Get SignedURL for limited access on resource (capTable)
router.get("/capTable/:id", startupController.getItemIdentifier, CloudStorageController.getSignedURL);

// Convert acraDocuments to live Link via CloudStorage
// Update Startup's acraDocuments field to to link in db. 
router.put("/acraDocuments/:id", CloudStorageController.uploadAcraDocuments, startupController.update);

// Get SignedURL for limited access on resource (capTable)
router.get("/acraDocuments/:id", startupController.getItemIdentifier, CloudStorageController.getSignedURL);

// Convert bankInfo to live Link via CloudStorage
// Update Startup's bankInfo field to to link in db. 
router.put("/bankInfo/:id", CloudStorageController.uploadBankInfo, startupController.update);

// Get SignedURL for limited access on resource (bankInfo)
router.get("/bankInfo/:id", startupController.getItemIdentifier, CloudStorageController.getSignedURL);

// Convert idProof to live Link via CloudStorage
// Update Startup's idProof field to to link in db. 
router.put("/idProof/:id", CloudStorageController.uploadIdProof, startupController.update);

// Get SignedURL for limited access on resource (idProof)
router.get("/idProof/:id", startupController.getItemIdentifier, CloudStorageController.getSignedURL);

// Convert profilePhoto to live Link via CloudStorage
// Update Startup's profilePhoto field to to link in db. 
router.put("/profilePhoto/:id", CloudStorageController.uploadProfilePhoto, startupController.update);

// Get SignedURL for limited access on resource (profilePhoto)
router.get("/profilePhoto/:id", startupController.getItemIdentifier, CloudStorageController.getSignedURL);


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
router.put("/campaign/update/:startupId", campaignController.checkExists, campaignController.update);

// Set commercialChampion
router.post("/setCommercialChampion/", commercialChampionController.create);

// Get milestone associated with startupId
router.get("/milestone/getMilestone/:startupId",   milestonePartController.getStartup, milestonePartController.getMilestone)

// create milestone part
router.post("/milestone/addPart/",   milestonePartController.create)

// Delete all milestones associated with startupId
router.delete("/milestone/deleteMilestone/",   milestonePartController.delete);

// Delete milestone part associated with startupId
router.delete("/milestone/deletePart/:companyId",   milestonePartController.deletePart);

// Associate industries to startup
router.post("/industries/addIndustries/",   industryController.create);


// Get campaign
// router.get("/getCampaign/:companyId", campaignController.findViaCompanyId);

// Get commercialChampion
router.get("/getCommercialChampion/:companyId", commercialChampionController.findViaCompanyId);

// Retrieve a single Startup with id
router.get("/:id", startupController.findOne);

// Retrieve all Startup
router.get("/", startupController.findAll);

module.exports = router;
