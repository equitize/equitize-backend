const startupController = require("../controllers/startup.controller");
const campaignController = require("../controllers/campaign.controller.js");
const commercialChampionController = require("../controllers/commercialChampion.controller.js");
const milestoneController = require("../controllers/milestone.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller");
const { campaign } = require("../models");
const CloudStorageController = require("../../cloudStorage/controllers/cloudStorage.controller");
const router = require("express").Router();


// Create a new Startup
router.post("/",
    // auth0Controller.getMgtToken,
    // auth0RegController.createAccount,
    // auth0RegController.startup,
    startupController.create
);

// Update a Startup with id
router.put("/:id", startupController.update);

// Delete a Startup with id
router.delete("/:id", startupController.delete);

// Delete all Startup
// maybe move to admin
router.delete("/", startupController.deleteAll);


// TO SET ALL OTHER PARAMS THEN THOSE IN CUSTOM, CHANGE THE PARAM OF BODY AND USE THE FOLLOWING PUT ROUTE TO UPDATE ALL OTHER PARAMS
// Update a Startup with id
// this should be an admin function
router.put("/:id", startupController.update);

// Convert StartUp Video to live Link via CloudStorage
// Update Startup's video field to to link in db.
router.put("/video/:id", CloudStorageController.uploadVideo, startupController.update);

// Get SignedURL for limited access on resource (video)
router.get("/video/:id", startupController.getItemIdentifier, CloudStorageController.getSignedURL)

// Convert Pitch Deck pdf to live Link via CloudStorage
// Update Startup's pitch deck field to to link in db.
router.put("/pitchDeck/:id", CloudStorageController.uploadPitchDeck, startupController.update);

// Get SignedURL for limited access on resource (pitchDeck)
router.get("/pitchDeck/:id", startupController.getItemIdentifier, CloudStorageController.getSignedURL)

// Retrieve Startup by name
router.get("/companyName/:companyName", startupController.findViaName);
// router.get("/companyName/:companyName", startup.findViaName);
//http://localhost:8080/api/db/startup/companyName/equitize

// Retrieve Startup by email
router.get("/email/:email", startupController.findViaEmail);
//http://localhost:8080/api/db/startup/companyName/equitize

// Set campaign with only companyID
// maybe use for admin
router.post("/setCampaign/", campaignController.create);

// Update Campaign Fields
// middleware first creates exists if campaign doesn't already exists
router.put("/campaign/update/:companyId", campaignController.checkExists, campaignController.update);

// Set commercialChampion
router.post("/setCommercialChampion/", commercialChampionController.create);

// Set milestone
router.post("/setMilestone/", milestoneController.create);

// Get campaign
router.get("/getCampaign/:companyId", campaignController.findViaCompanyId);

// Get commercialChampion
router.get("/getCommercialChampion/:companyId", commercialChampionController.findViaCompanyId);

// // Get milestone
router.get("/getMilestone/:companyId", milestoneController.findViaCompanyId);

///////////////////
// Retrieve a single Startup with id
router.get("/:id", startupController.findOne);

// Retrieve all Startup
router.get("/", startupController.findAll);

module.exports = router;
