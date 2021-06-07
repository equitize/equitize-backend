const junctionTable = require("../controllers/junctionTable.controller.js");
const router = require("express").Router();

// Create a new Startup
router.post("/", junctionTable.create);

// Retrieve a single Startup with id
router.get("/:id", junctionTable.findOne);

// Update a Startup with id
router.put("/:id", junctionTable.update);

// Delete a Startup with id
router.delete("/:id", junctionTable.delete);

// Delete all Startup
router.delete("/", junctionTable.deleteAll);

////////////////
//custom routes
///////////////

// Retrieve all investment entries belonging to startup 
router.get("/companyName/:companyName", junctionTable.findViaCompanyName);
//http://localhost:8080/api/db/junctionTable/companyName/equitize

// Retrieve all investment entries belonging to retail investor
router.get("/retailInvestorEmail/:retailInvestorEmail", junctionTable.findViaRetailInvestor);
//http://localhost:8080/api/db/junctionTable/retailInvestorEmail/jiale@gmail.com

///////////////////////
// Retrieve all Startup
router.get("/", junctionTable.findAll);

module.exports = router;
