const createHttpError = require("http-errors");
const startupService = require("../services/startup.service");

// Create and Save a new startup
exports.create = async (req, res, next) => {
  try {
    // Validate request
    if (!req.body.companyName || !req.body.emailAddress || !req.body.companyPassword) {
      res.status(400).send({    
        message: "companyName, emailAddress, companyPassword can not be empty!"
      });
      return;
    }
    // Create a startup
    // use ternary operator to handle null values 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
    const startup = {
      companyName: req.body.companyName,
      emailAddress: req.body.emailAddress,
      companyPassword: req.body.companyPassword,
      profileDescription: req.body.profileDescription ? req.body.profileDescription :"",
      profilePhoto: req.body.profilePhoto ? req.body.profilePhoto :"",
      capTable: req.body.capTable ? req.body.capTable :"",
      acraDocuments: req.body.acraDocuments ? req.body.acraDocuments :"",
      pitchDeckCloudID: req.body.pitchDeckCloudID ? req.body.pitchDeckCloudID :"",
      pitchDeckOriginalName: req.body.pitchDeckOriginalName ? req.body.pitchDeckOriginalName:"",
      videoCloudID: req.body.videoCloudID ? req.body.videoCloudID :"",
      videoOriginalName: req.body.videoOriginalName ? req.body.videoOriginalName :"",
      zoomDatetime: req.body.zoomDatetime ? req.body.zoomDatetime :"",
      commericalChampion: req.body.commericalChampion ? req.body.commericalChampion :"",
      designSprintDatetime: req.body.designSprintDatetime ? req.body.designSprintDatetime :"",
      bankInfo:req.body.bankInfo ? req.body.bankInfo :"",
      idProof:req.body.idProof ? req.body.idProof :"",
      zilAddr: req.body.zilAddr ? req.body.zilAddr : "",
    };
    
    // TK's implmentation of Service Layer
    startupService.create(startup)
    .then(function (response) {
      res.send(response)
    })
    .catch(function (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Startup."
      });
    })
  } catch (error) {
    next(error)
  };
};

// Retrieve all startups from the database.
exports.findAll = (req, res) => {
  
    // const company_name = req.query.company_name;
    // var condition = company_name ? { company_name: { [Op.like]: `%${company_name}%` } } : null;
  
    // TK's implementation of Service Layer
    startupService.findAll()
    .then(function (data) {
      if (data.length == 0) {
        res.status(404).send({
          message: "No StartUps in DB"
        }) 
      }
      else {
        res.send(data);
      }
    })
    .catch(function (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retreiving Startups."
      })
    });
};

// Find a single startup with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  
  // TK's implementation of service layer
  startupService.findOne(id)
  .then(function (response) {
    if (response == null) {
      res.status(500).send({
        message: "Startup with id=" + id
      })
    } else {
      res.send(response)
    }
  })
  .catch(function (err) {
    res.status(500).send({
      message: "Error retrieving Startup with id=" + id
    });
  }) 
};

// Update a startup by the id in the request
exports.update = (req, res) => {
  const startupId = req.params.startupId;
  // need to validate req.body in the future
  // TK's implementation of service layer
  startupService.update(req.body, startupId)
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Startup was updated successfully."
      });
    } else {
      res.status(500).send({
        message: `Cannot update Startup with id=${startupId}. Maybe Startup was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Startup with id=" + startupId
    });
  });
};

// Delete a startup with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  
  // TK's implementation of service layer
  startupService.delete(id)
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Startup was deleted successfully!"
      });
    } else {
      res.status(500).send({
        message: `Cannot delete Startup with id=${id}. Maybe Startup was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Startup with id=" + id
    });
  });
};

// Delete all startups from the database.
exports.deleteAll = (req, res) => {
  // TK's implementation of service layer
  startupService.deleteAll()
  .then(nums => {
    res.send({ message: `${nums} Startup were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all Startup."
    });
  });
};

// Retrieve startup via name from the database.
exports.findViaName = (req, res) => {
  // const company_name = req.query.company_name;
  const companyName = req.params.companyName;
  // var condition = company_name ? { company_name: { [Op.like]: `${company_name}` } } : null;

  // TK's implementation of service layer
  startupService.findViaName(companyName)
  .then(data => {
    if (data.length == 0) {
      res.status(404).send({
        message: `No Startup with specifed company name: ${companyName}`
      }) 
    }
    else {
      res.send(data);
    }
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Startups."
    });
  });
};

exports.findViaEmail= (req, res) => {
  const emailAddress = req.params.emailAddress;
  // TK's implementation
  startupService.findViaEmail(emailAddress)
  .then(data => {
    if (data.length == 0) {
      res.status(404).send({
        message: `No Startup with specifed email address: ${emailAddress}`
      }) 
    }
    else {
      res.send(data);
    }
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Startup."
    });
  });
  };

// middleware to get ItemID from MySQL
// and send back original file name 
exports.getItemIdentifierWithName = async (req, res, next) => {
  try {
    // const cloudIDType = req.body.cloudIDType;
    // const fileOGName = req.body.fileOGName;
    const fileType = req.params.fileType;
    const startupId = req.params.startupId
    const configs = embed(fileType)
    

    // use startupService to get access to startup object field    
    const startup = await startupService.findOne(startupId)    
    if (!startup) {
      throw createHttpError.NotFound();
    }
    if (startup.dataValues[configs.cloudIDType] === "") {
      throw createHttpError.NotFound();
    }
    req.body.cloudItemIdentifier = startup.dataValues[configs.cloudIDType]
    req.body.originalFileName = startup.dataValues[configs.fileOGName]
    next()
  } catch (error) {
    next(error);
  }
}


// middleware to get ItemID from MySQL 
// without sending back original name 
exports.getItemIdentifier = async (req, res, next) => {
  try {
    const fileType = req.params.fileType; 
    const startupId = req.params.startupId

    // use startupService to get access to startup object field    
    const startup = await startupService.findOne(startupId)    
    if (!startup) {
      throw createHttpError.NotFound();
    }
    if (startup.dataValues[fileType] === "") {
      throw createHttpError.NotFound();
    }
    req.body.fileType = startup.dataValues[fileType]
    next()
  } catch (error) {
    next(error);
  }
}

// function to embedd cloudIDType and fileOGName
const embed = function (fileType) {
  const utils = {
    "video" : {
      "cloudIDType" : "videoCloudID",
      "fileOGName"  : "videoOriginalName"
    },
    "pitchDeck" : {
      "cloudIDType" : "pitchDeckCloudID",
      "fileOGName"  : "pitchDeckOriginalName"
    }
  }
  return utils[fileType]
}