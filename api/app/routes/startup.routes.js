module.exports = app => {
    const startup = require("../controllers/startup.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Startup
    router.post("/", startup.create);
  
    // Retrieve all Startup
    router.get("/", startup.findAll);
  
    // Retrieve a single Startup with id
    router.get("/:id", startup.findOne);
  
    // Update a Startup with id
    router.put("/:id", startup.update);
  
    // Delete a Startup with id
    router.delete("/:id", startup.delete);
  
    // Delete all Startup
    router.delete("/", startup.deleteAll);
  
    app.use('/api/startup', router);
  };