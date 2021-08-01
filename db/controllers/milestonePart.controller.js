const createHttpError = require("http-errors");
const milestonePartService = require("../services/milestonePart.service");

exports.create = async (req, res, next) => {
  try {
    const startupId = req.params.startupId ? req.params.startupId : "";
    const milestonePart = await milestonePartService.createMilestonePart(startupId, {
        title: req.body.title,
        part: req.body.part,
        endDate: req.body.endDate,
        description: req.body.description,
        percentageFunds: req.body.percentageFunds,
    });
    
    if ( milestonePart.status === 200 ) {
      res.status(200).send({message: "milestonePart created succcesfully", milestonePart: milestonePart.milestonePart});
    } else {
      throw createHttpError[404];  
    }
    
  } catch (err) {
    next(err)
  }
}

// Delete a Milestone Part with the specified id in the request
exports.deletePart = (req, res) => {
  const startupId = req.params.startupId ? req.params.startupId : "";
  const milestonePart = req.body.part ? req.body.part : "";
  
  milestonePartService.deletePart(startupId, milestonePart)
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Milestone Part was deleted successfully!"
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Milestone with startupId=${startupId}. Maybe Milestone was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Milestone Part with startupId=" + startupId
    });
  });
}

// get a Milestone with the specified id in the request
exports.getMilestone = async (req, res) => {
  const startup = req.body.startup ? req.body.startup : "";
  const startupId = req.params.startupId ? req.params.startupId : "";
  try {
    const result = await startup.getMilestones();
    if ( result.length != 0 ) {
      res.send(result)
    } else {
      res.status(500).send({
        message: `Cannot get Milestone with startupId=${startupId}. Maybe Milestone was not found!`
      });
    }
    
  } catch (error) {
      return error
  }
}

// middleware to get startup
exports.getStartup = (req, res, next) => {
  const startupId = req.params.startupId ? req.params.startupId : "";
  try {
    const db = require("../models");
    const Startup = db.startups;
    
    const result = Startup.findByPk(startupId)
    .then(data => {
      if (!data) res.status(404).send({"error": `Startup with startupId=${startupId} not found`});
      if (data) {
        req.body.startup = data;
        next();
      };
      
    })
    .catch(err => {
      throw err    
    });
  } catch (error) {
    return error
}
  
}

// Delete a Milestone with the specified id in the request
exports.delete = (req, res) => {
  const startupId = req.params.startupId ? req.params.startupId : "";
  
  milestonePartService.delete(startupId)
  .then(num => {
    if (num != 0) {
      res.send({
        message: "Milestone Parts was deleted successfully!"
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Milestone with startupId=${startupId}. Maybe Milestone was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Milestone Part with startupId=" + startupId
    });
  });
}

// get all milestone parts
exports.findAll = async (req, res) => {
  milestonePartService.findAll()
  .then(function (data) {
    if (data.length == 0) {
      res.status(404).send({
        message: "No Milestone Parts in DB"
      }) 
    }
    else {
      res.send(data);
    }
  })
  .catch(function (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retreiving Milestone Parts."
    })
  });
};

exports.cronFindAll = async (conditions, attributes) => {
  try {
    const campaigns = await milestonePartService.findAll(conditions, attributes)
    return campaigns
  } catch (error) {
    return error 
  }
};