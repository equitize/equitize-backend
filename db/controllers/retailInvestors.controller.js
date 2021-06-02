const { retailInvestors } = require("../models");
// const db = require("../models");
// const RetailInvestors = db.retailInvestors;
// const Op = db.Sequelize.Op;
const retialInvestorService = require("../services/retailInvestor.service");

// Create and Save a new retailInvestor
exports.create = (req, res) => {
  // Validate request
  if (!req.body.email_address || !req.body.user_password) {
    res.status(400).send({
      message: "email_address, user_password can not be empty!"
    });
    return;
  }

  // Create a startup
  // use ternary operator to handle null values 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  const retailInvestors = {
    email_address: req.body.email_address,
    user_password: req.body.user_password,
    first_name: req.body.first_name ? req.body.first_name :"",
    last_name: req.body.last_name ? req.body.last_name :"",
    singpass: req.body.singpass ? req.body.singpass :"",
    income_statement: req.body.income_statement ? req.body.income_statement :"",
    income_tax_return: req.body.income_tax_return ? req.body.income_tax_return :""
  };

  // TK's implementation of service layer
  retialInvestorService.create(retailInvestors)
  .then(function (response) {
    res.send(response)
  })
  .catch(function (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Startup."
    });
  })


  // Save retailInvestor in the database
  // RetailInvestors.create(retailInvestors)
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while creating the RetailInvestors."
  //     });
  //   });
  
};

// Retrieve all retailInvestors from the database.
exports.findAll = (req, res) => {
    const email_address = req.query.email_address;
    // var condition = email_address ? { email_address: { [Op.like]: `%${email_address}%` } } : null;
    retialInvestorService.findAll(email_address)
    .then(function (response) {
      res.send(response)
    })
    .catch(function (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Startup."
      });
    })

    // RetailInvestors.findAll({ where: condition })
    //   .then(data => {
    //     res.send(data);
    //   })
    //   .catch(err => {
    //     res.status(500).send({
    //       message:
    //         err.message || "Some error occurred while retrieving RetailInvestors."
    //     });
    //   });
  
};

// Find a single retailInvestor with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    retialInvestorService.findOne(id)
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

    // RetailInvestors.findByPk(id)
    //   .then(data => {
    //     if (data == null){
    //       res.status(500).send({
    //         message: "RetailInvestors with id=" + id + " not found"
    //       });
    //     } else {
    //       res.send(data);
    //     }
    //   })
    //   .catch(err => {
    //     res.status(500).send({
    //       message: "Error retrieving RetailInvestors with id=" + id
    //     });
    //   });
  
};

// Update a retailInvestor by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  // Tk's implementation of service layer
  retialInvestorService.update(req.body, id)
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
  // RetailInvestors.update(req.body, {
  //   where: { id: id }
  // })
  //   .then(num => {
  //     if (num == 1) {
  //       res.send({
  //         message: "RetailInvestors was updated successfully."
  //       });
  //     } else {
  //       res.status(500).send({
  //         message: `Cannot update RetailInvestors with id=${id}. Maybe RetailInvestors was not found or req.body is empty!`
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message: "Error updating RetailInvestors with id=" + id
  //     });
  //   });
};

// Delete a retailInvestor with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    // Tk's implementation of service layer 
    retialInvestorService.delete(id)
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Startup was deleted successfully!"
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

    // RetailInvestors.destroy({
    //   where: { id: id }
    // })
    //   .then(num => {
    //     if (num == 1) {
    //       res.send({
    //         message: "RetailInvestors was deleted successfully!"
    //       });
    //     } else {
    //       res.status(500).send({
    //         message: `Cannot delete RetailInvestors with id=${id}. Maybe RetailInvestors was not found!`
    //       });
    //     }
    //   })
    //   .catch(err => {
    //     res.status(500).send({
    //       message: "Could not delete RetailInvestors with id=" + id
    //     });
    //   });
  
};

// Delete all retailInvestors from the database.
exports.deleteAll = (req, res) => {
  // Tk's implementation of service layer
  retialInvestorService.deleteAll()
  .then(nums => {
    res.send({ message: `${nums} RetailInvestors were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while removing all RetailInvestors."
    });
  });
  // RetailInvestors.destroy({
  //       where: {},
  //       truncate: false
  //     })
  //       .then(nums => {
  //         res.send({ message: `${nums} RetailInvestors were deleted successfully!` });
  //       })
  //       .catch(err => {
  //         res.status(500).send({
  //           message:
  //             err.message || "Some error occurred while removing all RetailInvestors."
  //         });
  //       });
};
///////////////////
exports.findViaEmail= (req, res) => {
  // const email = req.query.email;
  const email = req.params.email;
  // var condition = email ? { email_address: { [Op.like]: `${email}` } } : null;
  
  // Tk's implementation of service layer
  retialInvestorService.findViaEmail(email)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving RetailInvestors."
    });
  });
  // RetailInvestors.findAll({ where: condition })
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving RetailInvestors."
  //     });
  //   });
  };