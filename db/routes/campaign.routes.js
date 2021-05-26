const campaign = require("../controllers/campaign.controller.js");
const router = require("express").Router();

// Create a new Startup
router.post("/", campaign.create);

// Retrieve all Startup
router.get("/", campaign.findAll);

// Retrieve a single Startup with id
router.get("/:id", campaign.findOne);

// Update a Startup with id
router.put("/:id", campaign.update);

// Delete a Startup with id
router.delete("/:id", campaign.delete);

// Delete all Startup
router.delete("/", campaign.deleteAll);

////////////////
//custom routes
///////////////

// Retrieve campaign by startup name
router.get("/company_name/:company_name", campaign.findViaCompanyName);
//http://localhost:8080/api/db/campaign/company_name/bloo

module.exports = router;

