const db = require("../models");
const CommercialChampion = db.commercialChampion;
const Op = db.Sequelize.Op;

// Create and Save a new startup
exports.create = (req, res) => {
  try {
    // Validate request
    if (!req.body.name || !req.body.email || !req.body.company_id ) {
      res.status(400).send({    
        message: "name, email, company_id can not be empty!"
      });
      return;
    }
    // Create a startup
    // use ternary operator to handle null values 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
    const commercialChampion = {
      company_id: req.body.company_id,
      name: req.body.name,
      email: req.body.email,
      profession: req.body.profession ? req.body.profession :"",
      fields_of_interest: req.body.fields_of_interest ? req.body.fields_of_interest :"",
    };
    
    CommercialChampion.create(commercialChampion)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the CommercialChampion."
        });
      });
  } catch (error) {
    next(error)
  }
  
};

// Retrieve all startups from the database.
exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
  
    CommercialChampion.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving CommercialChampion."
        });
      });
  
};

// Find a single startup with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    CommercialChampion.findByPk(id)
      .then(data => {
        if (data == null){
          res.status(500).send({
            message: "Startup with id=" + id
          })
        } else {
        res.send(data);
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving CommercialChampion with id=" + id
        });
      });
  
};

// Update a startup by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  CommercialChampion.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "CommercialChampion was updated successfully."
        });
      } else {
        res.status(500).send({
          message: `Cannot update CommercialChampion with id=${id}. Maybe CommercialChampion was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Startup with id=" + id
      });
    });
};

// Delete a startup with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    CommercialChampion.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "CommercialChampion was deleted successfully!"
          });
        } else {
          res.status(500).send({
            message: `Cannot delete CommercialChampion with id=${id}. Maybe CommercialChampion was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete CommercialChampion with id=" + id
        });
      });
  
};

// Delete all startups from the database.
exports.deleteAll = (req, res) => {
  CommercialChampion.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} CommercialChampion were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all CommercialChampion."
          });
        });
};

/////////////
//custom functions ////
// Retrieve CommercialChampion via name from the database.
exports.findViaName = (req, res) => {
  // const company_name = req.query.company_name;
  const name = req.params.name;
  // console.log(req.query)
  var condition = name ? { name: { [Op.like]: `${name}` } } : null;

  CommercialChampion.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CommercialChampion."
      });
    });

};
// Retrieve via company_id
exports.findViaCompanyId = (req, res) => {
  // const company_name = req.query.company_name;
  const company_id = req.params.company_id;
  // console.log(req.query)
  var condition = company_id ? { company_id: { [Op.like]: `${company_id}` } } : null;

  CommercialChampion.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving CommercialChampion."
      });
    });

};




