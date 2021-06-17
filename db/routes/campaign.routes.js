const campaign = require("../controllers/campaign.controller.js");
const router = require("express").Router();
// Maybe have this as admin utility since retail investors/startups have access to campaign services via their routes


// Create a new Startup
router.post("/", campaign.create);

// Retrieve all Startup
router.get("/", campaign.findAll);

// Retrieve a single Startup with id
router.get("/:id", campaign.findOne);

// Update a Startup with companyIid
router.put("/:startupId", campaign.update);

// Delete a Startup with id
router.delete("/:id", campaign.delete);

// Delete all Startup
router.delete("/", campaign.deleteAll);

// Retrieve campaign by startup name
router.get("/campaign/:companyId", campaign.findViaCompanyId);
//http://localhost:8080/api/db/campaign/campaign/1

module.exports = router;

