const createHttpError = require("http-errors");
const { retailInvestors, campaigns } = require("../models");
const retailInvestorService = require("../services/retailInvestor.service");
const startupService = require("../services/startup.service");

// Create and Save a new retailInvestor
exports.create = (req, res, next) => {
  // Validate request
  if (!req.body.emailAddress || !req.body.password) {
    res.status(400).send({
      message: "emailAddress, userPassword can not be empty!"
    });
    return;
  }

  // Create a startup
  // use ternary operator to handle null values 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  const retailInvestors = {
    emailAddress: req.body.emailAddress,
    password: req.body.password,
    firstName: req.body.firstName ? req.body.firstName :"",
    lastName: req.body.lastName ? req.body.lastName :"",
    singPass: req.body.singPass ? req.body.singPass :"",
    incomeStatement: req.body.incomeStatement ? req.body.incomeStatement :"",
    incomeTaxReturn: req.body.incomeTaxReturn ? req.body.incomeTaxReturn :"", 
    zilAddr: req.body.zilAddr ? req.body.zilAddr : "",
    auth0ID: req.body.user_id ? req.body.user_id: ""
  };

  retailInvestorService.create(retailInvestors)
  .then(function (response) {
    // if (process.env.NODE_ENV == 'test') {res.send(response)}
    req.body.retailInv = response;
    next();
  })
  .catch(function (err) { 
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Retail Investor."
    });
  })
};

// Retrieve all retailInvestors from the database.
exports.findAll = (req, res) => {
    const emailAddress = req.query.emailAddress;
    // var condition = email_address ? { email_address: { [Op.like]: `%${email_address}%` } } : null;
    retailInvestorService.findAll(emailAddress)
    .then(function (response) {
      res.send(response)
    })
    .catch(function (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Startup."
      });
    })
};

// Find a single retailInvestor with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    retailInvestorService.findOne(id)
    .then(function (response) {
      if (response == null) {
        res.status(500).send({
          message: "RetailInvestors with id=" + id + " not found"
        })
      } else {
        res.send(response)
      }
    })
    .catch(function (err) {
      res.status(500).send({
        message: "Error retrieving RetailInvestors with id=" + id
      });
    })
};

// Find a single retailInvestor by email
exports.findIDByEmail = (req, res) => {
  const emailAddress = req.body.emailAddress;
  retailInvestorService.findIDByEmail(emailAddress)
  .then(function (response) {
    if (response == null) {
      res.status(500).send({
        message: "RetailInvestors with email=" + emailAddress + " not found"
      })
    } else {
      const id = JSON.parse(JSON.stringify(response))
      if (!id) throw createHttpError[404]
      retailInvObject = {
        retailInvID: id,
        auth0: req.body.accessToken
      }
      res.send(retailInvObject)
    }
  })
  .catch(function (err) {
    res.status(500).send({
      message: "Error retrieving RetailInvestors with email=" + email
    });
  })
};

// Update a retailInvestor by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  // Tk's implementation of service layer
  retailInvestorService.update(req.body, id)
  .then(num => {
    if (num == 1) {
      res.send({
        message: "RetailInvestors was updated successfully."
      });
    } else {
      res.status(500).send({
        message: `Cannot update RetailInvestors with id=${id}. Maybe RetailInvestors was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating RetailInvestors with id=" + id
    });
  });
};

// Delete a retailInvestor with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    // Tk's implementation of service layer 
    retailInvestorService.delete(id)
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Retail Investor was deleted successfully!"
        });
      } else {
        res.status(500).send({
          message: `Cannot delete RetailInvestors with id=${id}. Maybe RetailInvestors was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete RetailInvestors with id=" + id
      });
    });
};

// Delete all retailInvestors from the database.
exports.deleteAll = (req, res) => {
  retailInvestorService.deleteAll()
  .then(nums => {
    res.send({ message: `${nums} RetailInvestors were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all RetailInvestors."
    });
  });
};

exports.findViaEmail= (req, res) => {
  const email = req.params.email ? req.params.email : "";
  retailInvestorService.findViaEmail(email)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving RetailInvestors."
    });
  });
};

exports.addCampaign = async (req, res, next) => {
  try {
    const retailInvID = req.body.retailInvID ? req.body.retailInvID : "";
    const campaign = req.body.campaign ? req.body.campaign : ""; 
    
    const a = JSON.parse(JSON.stringify(campaign));
    const retailInv = await retailInvestorService.findOne(retailInvID);
  
    const status = await retailInv.addCampaigns(a.startupId);
    res.status(200).send({
      "Campaign": `Succesfully pledged to Campaign ${a.startupId}`,
      "RetailInv": `Succesfully associated RetailInv ${retailInvID} to Campaign ${a.startupId}`
    })
  } catch (error) {
    next(error);
  };
};