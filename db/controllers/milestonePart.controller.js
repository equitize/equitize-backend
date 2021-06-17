const milestonePartService = require("../services/milestonePart.service");

exports.create = async (req, res) => {
  try {
    const startupId = req.body.startupId
    const milestonePart = await milestonePartService.createMilestonePart(startupId, {
        title: req.body.title,
        part: req.body.part,
        endDate: req.body.endDate,
        description: req.body.description,
        percentageFunds: req.body.percentageFunds,
    });
    res.send(milestonePart)
  } catch (err) {
      console.log(err)
  }
}

// Delete a Milestone Part with the specified id in the request
exports.deletePart = (req, res) => {
  const companyId = req.params.companyId
  const milestonePart = req.body.part;
  
  milestonePartService.deletePart(companyId, milestonePart)
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Milestone Part was deleted successfully!"
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Milestone with companyId=${companyId}. Maybe Milestone was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Milestone Part with companyId=" + companyId
    });
  });
}

// get a Milestone with the specified id in the request
exports.getMilestone = async (req, res) => {
  const startup = req.body.startup;
  const startupId = req.params.startupId;
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
  const startupId = req.params.startupId
  try {
    const db = require("../models");
    const Startup = db.startups;
    
    const result = Startup.findByPk(startupId)
    .then(data => {
      req.body.startup = data
      console.log('milestone.getstartup >>')
      next();
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
  const startupId = req.body.startupId
  
  milestonePartService.delete(startupId)
  .then(num => {
    console.log(num)
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
