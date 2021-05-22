module.exports = app => {
    const junctionTable = require("../controllers/junctionTable.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Startup
    router.post("/", junctionTable.create);
  
    // Retrieve all Startup
    router.get("/", junctionTable.findAll);
  
    // Retrieve a single Startup with id
    router.get("/:id", junctionTable.findOne);
  
    // Update a Startup with id
    router.put("/:id", junctionTable.update);
  
    // Delete a Startup with id
    router.delete("/:id", junctionTable.delete);
  
    // Delete all Startup
    router.delete("/", junctionTable.deleteAll);
  
    app.use('/api/junctionTable', router);
  };