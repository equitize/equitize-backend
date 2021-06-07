const retailInvestors = require("../controllers/retailInvestors.controller.js");
const auth0Controller = require("../../auth0/controllers/backend.controller");
const auth0RegController = require("../../auth0/controllers/registration.controller");
const router = require("express").Router();

// Create a new Startup
router.post("/", 
// auth0Controller.getMgtToken, 
// auth0RegController.createAccount, 
// auth0RegController.retailInvestors,
retailInvestors.create);

// Retrieve all Startup
router.get("/", retailInvestors.findAll);

// Retrieve a single Startup with id
router.get("/:id", retailInvestors.findOne);

// Update a Startup with id
router.put("/:id", retailInvestors.update);

// Delete a Startup with id
router.delete("/:id", retailInvestors.delete);

// Delete all Startup
router.delete("/", retailInvestors.deleteAll);

// Retrieve Startup by email
router.get("/email/:emailAddress", retailInvestors.findViaEmail);
//http://localhost:8080/api/db/retailInvestors/email/kenny@mail.xyz

module.exports = router;