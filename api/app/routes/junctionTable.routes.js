module.exports = app => {
    const junctionTable = require("../controllers/junctionTable.controller.js");
  
    var router = require("express").Router();
  
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
    router.get("/company_name/:company_name", junctionTable.findViaCompanyName);
    //http://localhost:8080/api/junctionTable/company_name/equitize

    // Retrieve all investment entries belonging to retail investor
    router.get("/retail_investor_email/:retail_investor_email", junctionTable.findViaRetailInvestor);
    //http://localhost:8080/api/junctionTable/retail_investor_email/jiale@gmail.com
    
    ///////////////////////
    // Retrieve all Startup
    router.get("/", junctionTable.findAll);

    app.use('/api/junctionTable', router);
  };