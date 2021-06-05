const campaign = require("../controllers/campaign.controller.js");
const router = require("express").Router();
// Maybe have this as admin utility since retail investors/startups have access to campaign services via their routes


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
router.get("/campaign/:companyId", campaign.findViaCompanyId);
//http://localhost:8080/api/db/campaign/company_name/bloo

module.exports = router;

