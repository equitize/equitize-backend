const db = require("../models");
const JunctionTable = db.junctionTable;
const Op = db.Sequelize.Op;

// Create and Save a new JunctionTable
exports.create = (req, res) => {
  // Validate request
  if (!req.body.retail_investor_email && !req.body.company_name && !req.body.amount) {
    res.status(400).send({
      message: "retail_investor_email, company_name, amount can not be empty!"
    });
    return;
  }

  // Create a JunctionTable
  // use ternary operator to handle null values 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  const junctionTable = {
    retail_investor_email: req.body.retail_investor_email,
    company_name: req.body.company_name,
    amount: req.body.amount ,
  };

  // Save JunctionTable in the database
  JunctionTable.create(junctionTable)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the JunctionTable."
      });
    });
  
};

// Retrieve all JunctionTable from the database.
exports.findAll = (req, res) => {
    const company_name = req.query.company_name;
    var condition = company_name ? { company_name: { [Op.like]: `%${company_name}%` } } : null;
  
    JunctionTable.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving JunctionTable."
        });
      });
  
};

// Find a single JunctionTable with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    JunctionTable.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving JunctionTable with id=" + id
        });
      });
  
};

// Update a JunctionTable by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  JunctionTable.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "JunctionTable was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update JunctionTable with id=${id}. Maybe JunctionTable was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating JunctionTable with id=" + id
      });
    });
};

// Delete a JunctionTable with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    JunctionTable.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "JunctionTable was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete JunctionTable with id=${id}. Maybe JunctionTable was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete JunctionTable with id=" + id
        });
      });
  
};

// Delete all JunctionTable from the database.
exports.deleteAll = (req, res) => {
  JunctionTable.destroy({
        where: {},
        truncate: false
      })
        .then(nums => {
          res.send({ message: `${nums} JunctionTable were deleted successfully!` });
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while removing all JunctionTable."
          });
        });
};

