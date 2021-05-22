module.exports = app => {
    const retailInvestors = require("../controllers/retailInvestors.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Startup
    router.post("/", retailInvestors.create);
  
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
  
    app.use('/api/retailInvestors', router);
  };