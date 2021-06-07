const startup = require("../controllers/startup.controller");
const campaign = require("../controllers/campaign.controller.js");
const commercialChampion = require("../controllers/commercialChampion.controller.js");
const milestone = require("../controllers/milestone.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller");
const router = require("express").Router();


// Create a new Startup
router.post("/", 
    // auth0Controller.getMgtToken,
    auth0RegController.createAccount,
    auth0RegController.startup,
    startup.create
);

// Update a Startup with id
router.put("/:id", startup.update);

// Delete a Startup with id
router.delete("/:id", startup.delete);

// Delete all Startup
router.delete("/", startup.deleteAll);

////////////////
//custom routes
///////////////

// TO SET ALL OTHER PARAMS THEN THOSE IN CUSTOM, CHANGE THE PARAM OF BODY AND USE THE FOLLOWING PUT ROUTE TO UPDATE ALL OTHER PARAMS
// Update a Startup with id
router.put("/:id", startup.update);

// Retrieve Startup by name
router.get("/company_name/:company_name", startup.findViaName);
// router.get("/company_name/:company_name", startup.findViaName);
//http://localhost:8080/api/db/startup/company_name/equitize

// Retrieve Startup by email
router.get("/email/:email", startup.findViaEmail);
//http://localhost:8080/api/db/startup/company_name/equitize

// Set campaign
router.post("/setCampaign/", campaign.create);

// Set commercialChampion
router.post("/setCommercialChampion/", commercialChampion.create);

// Set milestone
router.post("/setMilestone/", milestone.create);

// // Get campaign
router.get("/getCampaign/:company_id", campaign.findViaCompanyId);

// // Get commercialChampion
router.get("/getCommercialChampion/:company_id", commercialChampion.findViaCompanyId);

// // Get milestone
router.get("/getMilestone/:commpany_id", milestone.findViaCompanyId);

///////////////////
// Retrieve a single Startup with id
router.get("/:id", startup.findOne);

// Retrieve all Startup
router.get("/", startup.findAll);

module.exports = router; 