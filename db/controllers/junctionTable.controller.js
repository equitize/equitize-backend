// const db = require("../models");
// const JunctionTable = db.junctionTable;
// const Op = db.Sequelize.Op;
const junctionTableService = require("../services/junctionTable.service");

// Create and Save a new junctionTable
exports.create = (req, res) => {
  // Validate request
  if (!req.body.retailInvestorId || !req.body.companyId || !req.body.amount) {
    res.status(400).send({
      message: "retailInvestorId, companyId, amount can not be empty!"
    });
    return;
  }

  // Create a JunctionTable
  // use ternary operator to handle null values 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  const junctionTable = {
    retailInvestorId: req.body.retailInvestorId,
    companyId: req.body.companyId,  // TODO: discuss whether this should be the campaign instead
    amount: req.body.amount,
  };

  // Tk's implementation of service layer 
  junctionTableService.create(junctionTable)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the JunctionTable."
    });
  });
  // Save JunctionTable in the database
  // JunctionTable.create(junctionTable)
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while creating the JunctionTable."
  //     });
  //   });
  
};

// Retrieve all JunctionTable from the database.
exports.findAll = (req, res) => {
    const companyName = req.query.companyName;
    // var condition = company_name ? { company_name: { [Op.like]: `%${company_name}%` } } : null;
    // Tk's implementation of service layer 
    junctionTableService.findAll(companyName)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving JunctionTable."
      });
    });
    // JunctionTable.findAll({ where: condition })
    //   .then(data => {
    //     res.send(data);
    //   })
    //   .catch(err => {
    //     res.status(500).send({
    //       message:
    //         err.message || "Some error occurred while retrieving JunctionTable."
    //     });
    //   });
};

// Find a single JunctionTable with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    // Tk's implementation of service layer
    junctionTableService.findOne(id)
    .then(data => {
      if (data == null){
        res.status(500).send({
          message: "JunctionTable with id=" + id + " not found"
        });
      } else {
        res.send(data);
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving JunctionTable with id=" + id
      });
    });
    // JunctionTable.findByPk(id)
    //   .then(data => {
    //     if (data == null){
    //       res.status(500).send({
    //         message: "JunctionTable with id=" + id + " not found"
    //       });
    //     } else {
    //       res.send(data);
    //     }
    //   })
    //   .catch(err => {
    //     res.status(500).send({
    //       message: "Error retrieving JunctionTable with id=" + id
    //     });
    //   });
};

// Update a JunctionTable by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  // Tk's implementation of service layer
  junctionTableService.update(req.body, id)
  .then(num => {
    if (num == 1) {
      res.send({
        message: "JunctionTable was updated successfully."
      });
    } else {
      res.status(500).send({
        message: `Cannot update JunctionTable with id=${id}. Maybe JunctionTable was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating JunctionTable with id=" + id
    });
  });

  // JunctionTable.update(req.body, {
  //   where: { id: id }
  // })
  //   .then(num => {
  //     if (num == 1) {
  //       res.send({
  //         message: "JunctionTable was updated successfully."
  //       });
  //     } else {
  //       res.status(500).send({
  //         message: `Cannot update JunctionTable with id=${id}. Maybe JunctionTable was not found or req.body is empty!`
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Error updating JunctionTable with id=" + id
  //     });
  //   });
};

// Delete a JunctionTable with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  // Tk's implementation of service layer
  junctionTableService.delete(id)
  .then(num => {
    if (num == 1) {
      res.send({
        message: "JunctionTable was deleted successfully!"
      });
    } else {
      res.status(500).send({
        message: `Cannot delete JunctionTable with id=${id}. Maybe JunctionTable was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete JunctionTable with id=" + id
    });
  });
  // JunctionTable.destroy({
  //   where: { id: id }
  // })
  //   .then(num => {
  //     if (num == 1) {
  //       res.send({
  //         message: "JunctionTable was deleted successfully!"
  //       });
  //     } else {
  //       res.status(500).send({
  //         message: `Cannot delete JunctionTable with id=${id}. Maybe JunctionTable was not found!`
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Could not delete JunctionTable with id=" + id
  //     });
  //   });
};

// Delete all JunctionTable from the database.
exports.deleteAll = (req, res) => {
  // Tk's implementation of service layer
  junctionTableService.deleteAll()
  .then(nums => {
    res.send({ message: `${nums} JunctionTable were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all JunctionTable."
    });
  });
  // JunctionTable.destroy({
  //   where: {},
  //   truncate: false
  // })
  // .then(nums => {
  //   res.send({ message: `${nums} JunctionTable were deleted successfully!` });
  // })
  // .catch(err => {
  //   res.status(500).send({
  //     message:
  //       err.message || "Some error occurred while removing all JunctionTable."
  //   });
  // });
};

/////////////
//custom function
/////////////

exports.findViaCompanyName = (req, res) => {
  const company_name = req.params.companyName;
  // const company_name = req.query.company_name;
  // console.log(req.query)
  // var condition = company_name ? { company_name: { [Op.like]: `${company_name}` } } : null;

  // Tk's implementation of service layer
  junctionTableService.findViaCompanyName(companyName)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving JunctionTable."
    });
  });
  // JunctionTable.findAll({ where: condition })
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving JunctionTable."
  //     });
  //   });
};


exports.findViaRetailInvestor = (req, res) => {
  const retailInvestorEmail = req.params.retailInvestorEmail;
  // const retail_investor_email = req.query.retail_investor_email;
  // var condition = retail_investor_email ? { retail_investor_email: { [Op.like]: `${retail_investor_email}` } } : null;
  
  // Tk's implementation of service layer
  junctionTableService.findViaRetailInvestor(retailInvestorEmail)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving JunctionTable."
    });
  });


  // JunctionTable.findAll({ where: condition })
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving JunctionTable."
  //     });
  //   });
  
};
