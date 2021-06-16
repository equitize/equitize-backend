const startupController = require("../controllers/startup.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const campaignController = require("../controllers/campaign.controller");
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

module.exports = router; 