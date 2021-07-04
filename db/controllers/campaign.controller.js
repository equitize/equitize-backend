const createHttpError = require("http-errors");
const startupService = require("../services/startup.service")
const campaignService = require("../services/campaign.service");
const retailInvestorService = require("../services/retailInvestor.service");
const dbConstants = require("../constants/constants");

// Create and Save a new Campaign
exports.create = (req, res) => {
  // Validate request
  if (!req.body.startupId) {
    res.status(400).send({
      message: "startupId cannot be empty!"
    });
    return;
  }
  
  // Create a Campaign
  // use ternary operator to handle null values 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  const campaign = {
    startupId: req.body.startupId,
    goal: req.body.goal,
    endDate: req.body.endDate,
    sharesAllocated: req.body.sharesAllocated,
    currentlyRaised: req.body.currentlyRaised
  };
  // tk's implementation of service layer
  campaignService.create(campaign)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Campaign."
    });
  });
};

// Retrieve all Campaign from the database by company_id
exports.findAllByCompanyID = (req, res) => {
  const companyId = req.query.companyId;
  // var condition = company_id ? { company_id: { [Op.like]: `%${company_id}%` } } : null;
  
  // tk's implementation of service layer
  campaignService.findAllByCompanyID(companyId)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Campaign."
    });
  });
};

// Find a single Campaign with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  // tk's implementation of service layer
  campaignService.findOne(id)
  .then(data => {
    if (data === null){
      res.status(500).send({
        message: "Campaign with id=" + id + " not found"
      })
    } else {
      res.send(data);
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Campaign with id=" + id
    });
  });
};

// Update a Campaign by the id in the request
exports.update = (req, res) => {
  const startupId = req.params.startupId ? req.params.startupId : "";
  const campaign = req.body;
  campaign["SCdeployedStatus"] = false;
  campaign["startupId"] = startupId;
  campaign["campaignStatus"] = dbConstants.campaign.status.NONLIVE;
  campaignService.update(campaign, startupId)
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Campaign was updated successfully."
      });
    } else {
      res.status(500).send({
        message: `Cannot update Campaign with id=${startupId}. Maybe Campaign was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Campaign with id=" + startupId
    });
  });
};

// Delete a Campaign with the specified id in the request
// TODO: discuss whether a Campaign can be deleted with unresolved investments
// TODO: what is this relationship with the blockchain
exports.delete = (req, res) => {
  const id = req.params.id;
  // tk's implementation of service layer
  campaignService.delete(id)
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Campaign was deleted successfully!"
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Campaign with id=${id}. Maybe Startup was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Campaign with id=" + id
    });
  });
};

// Delete all Campaign from the database.
exports.deleteAll = (req, res) => {
  // tk's implementation of service layer
  campaignService.deleteAll()
  .then(nums => {
    res.send({ message: `${nums} Campaign were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all Campaign."
    });
  });
};

exports.findViaCompanyId = (req, res) => {
  const companyId = req.params.companyId;

  // tk's implementation of service layer
  campaignService.findViaCompanyId(companyId)
  .then(data => {
    if (data.length === 0){
      res.status(500).send({
        message: "Campaign with id=" + companyId + " not found"
      })
    } else {
      res.send(data);
    }
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Campaign."
    });
  });
};

// middleware to check if campaign exists
// otherwise create one and move to next middleware
exports.checkExists = async (req, res, next) => {
  // TODO: Check if there exists a campaign with FK=startupId
  const startupId = req.params.startupId ? req.params.startupId : "";
  // campaignService.findOne

  const startup = await startupService.findOne(startupId);
  if (startup === null) {res.status(404).send({'message': `Startup with startupId=${startupId} not found`})}
  const campaign = await startup.getCampaign();
  
  if (campaign === null) {
    // create campaign
    const campaign = {
      startupId: startupId,
    }
    campaignService.create(campaign)
    next()
  } else {
    next()
  }
};

// middleware to get campaign associated to given startupId
exports.getStartup = (req, res, next) => {
  const startupId = req.params.startupId ? req.params.startupId : "";
  try {
    const db = require("../models");
    const Startup = db.startups;
    
    const result = Startup.findByPk(startupId)
    .then(data => {
      req.body.startup = data
      next();
    })
    .catch(err => {
      throw err    
    });
  } catch (error) {
      return error
  }
}

// Get a campaign with the specified id in the request
// and make a pledge to it
exports.pledgeAmount = async (req, res, next) => {
  const startup = req.body.startup ? req.body.startup : "";
  const startupId = req.params.startupId ? req.params.startupId : "" ;
  const pledgeAmount = req.body.pledgeAmount ? req.body.pledgeAmount : "";
  try {
    const campaign = await startup.getCampaign();
    if (!campaign) {
      throw createHttpError.NotFound();
    }
    else if ( pledgeAmount < 0 ) {
      throw createHttpError.BadRequest();
    }
    else if ( campaign )  { // exists a valid campaign
      var currentlyRaised = JSON.parse(JSON.stringify(campaign)).currentlyRaised;
      if (currentlyRaised == null) {
        console.log('null detected')
        currentlyRaised = pledgeAmount
      }
      else {
        currentlyRaised = currentlyRaised + pledgeAmount
      };

      const updated = await campaignService.update({ "currentlyRaised" : currentlyRaised }, startupId);
      if (updated[0] === 1) {
        req.body.campaign = campaign;
        next()
      } else {
        throw updated
      }
    }
    
  } catch (error) {
    next(error)
  }
}

exports.findAll = async (req, res, next) => {
  try {
    const campaigns = await campaignService.findAll()
    res.send(campaigns)
  } catch (error) {
    next(error)
  }
}

exports.cronFindAll = async (conditions, attributes) => {
  try {
    const campaigns = await campaignService.findAll(conditions, attributes)
    return campaigns
  } catch (error) {
    return error 
  }
};

exports.cronUpdate = async (updates, startupId) => {
  return campaignService.update(updates, startupId)
  .then(num => {
    if (num == 1) {
      return {
        message: "Campaign was updated successfully."
      };
    } else {
      return {
        message: `Cannot update Campaign with id=${startupId}. Maybe Campaign was not found or req.body is empty!`
      };
    }
  })
  .catch(err => {
    throw err.message("Error updating Campaign with id=" + startupId)  
  });
};