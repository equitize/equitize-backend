const db = require("../models");
const Campaign = db.campaign;
const Op = db.Sequelize.Op;

// Create and Save a new Campaign
exports.create = (req, res) => {
  // Validate request
  if (!req.body.company_name && !req.body.goal && !req.body.end_date) {
    res.status(400).send({
      message: "company_name, goal, end_date can not be empty!"
    });
    return;
  }

  // Create a Campaign
  // use ternary operator to handle null values 
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
  const campaign = {
    company_name: req.body.company_name,
    goal: req.body.goal,
    end_date: req.body.end_date
  };

  // Save Campaign in the database
  Campaign.create(campaign)
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

// Retrieve all Campaign from the database.
exports.findAll = (req, res) => {
    const company_name = req.query.company_name;
    var condition = company_name ? { company_name: { [Op.like]: `%${company_name}%` } } : null;
  
    Campaign.findAll({ where: condition })
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

    Campaign.findByPk(id)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Campaign with id=" + id
        });
      });
  
};

// Update a Campaign by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Campaign.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Campaign was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Campaign with id=${id}. Maybe Campaign was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Campaign with id=" + id
      });
    });
};

// Delete a Campaign with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Campaign.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Campaign was deleted successfully!"
          });
        } else {
          res.send({
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
  Campaign.destroy({
        where: {},
        truncate: false
      })
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

///////
exports.findViaCompanyName = (req, res) => {
  // const company_name = req.query.company_name;
  const company_name = req.params.company_name;
  // console.log(req.query)
  var condition = company_name ? { company_name: { [Op.like]: `${company_name}` } } : null;

  Campaign.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Startups."
      });
    });

};