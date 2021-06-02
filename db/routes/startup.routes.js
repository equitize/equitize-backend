const startupController = require("../controllers/startup.controller");
const campaignController = require("../controllers/campaign.controller.js");
const commercialChampionController = require("../controllers/commercialChampion.controller.js");
const milestoneController = require("../controllers/milestone.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller");
const { campaign } = require("../models");
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

////////////////
//custom routes
///////////////

// TO SET ALL OTHER PARAMS THEN THOSE IN CUSTOM, CHANGE THE PARAM OF BODY AND USE THE FOLLOWING PUT ROUTE TO UPDATE ALL OTHER PARAMS
// Update a Startup with id
// this should be an admin function
router.put("/:id", startupController.update);

// Convert StartUp Video to live Link via CloudStorage
// Update Startup's video field to to link in db. 
router.put("/video/:id", startupController.uploadVideo, startupController.update);


// Convert Pitch Deck pdf to live Link via CloudStorage
// Update Startup's pitch deck field to to link in db. 
router.put("/pitchDeck/:id", startupController.uploadPitchDeck, startupController.update);

// Retrieve Startup by name
router.get("/company_name/:company_name", startupController.findViaName);
// router.get("/company_name/:company_name", startup.findViaName);
//http://localhost:8080/api/db/startup/company_name/equitize

// Retrieve Startup by email
router.get("/email/:email", startupController.findViaEmail);
//http://localhost:8080/api/db/startup/company_name/equitize

// Set campaign with only companyID
// maybe use for admin
router.post("/setCampaign/", campaignController.create);

// Update Campaign Fields
// middleware first creates exists if campaign doesn't already exists
router.put("/campaign/update/:company_id", campaignController.checkExists, campaignController.update);

// Set commercialChampion
router.post("/setCommercialChampion/", commercialChampionController.create);

// Set milestone
router.post("/setMilestone/", milestoneController.create);

// Get campaign
router.get("/getCampaign/:company_id", campaignController.findViaCompanyId);

// Get commercialChampion
router.get("/getCommercialChampion/:company_id", commercialChampionController.findViaCompanyId);

// // Get milestone
router.get("/getMilestone/:company_id", milestoneController.findViaCompanyId);

///////////////////
// Retrieve a single Startup with id
router.get("/:id", startupController.findOne);

// Retrieve all Startup
router.get("/", startupController.findAll);

module.exports = router; 