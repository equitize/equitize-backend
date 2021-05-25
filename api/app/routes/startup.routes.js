module.exports = app => {
    const startup = require("../controllers/startup.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Startup
    router.post("/", startup.create);
  
    // Update a Startup with id
    router.put("/:id", startup.update);
  
    // Delete a Startup with id
    router.delete("/:id", startup.delete);
  
    // Delete all Startup
    router.delete("/", startup.deleteAll);

    ////////////////
    //custom routes
    ///////////////

    // Retrieve Startup by name
    router.get("/company_name/:company_name", startup.findViaName);
    // router.get("/company_name/:company_name", startup.findViaName);
    //http://localhost:8080/api/startup/company_name/equitize

    // Retrieve Startup by email
    router.get("/email/:email", startup.findViaEmail);
    //http://localhost:8080/api/startup/company_name/equitize

    ///////////////////
    // Retrieve a single Startup with id
    router.get("/:id", startup.findOne);

    // Retrieve all Startup
    router.get("/", startup.findAll);

  
    app.use('/api/startup', router);
  };