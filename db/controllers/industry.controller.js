const industryService = require("../services/industry.service");

exports.create = async (req, res, next) => {
    try {
        const id = req.body.id
        const industryNames = req.body.industryNames
        const accountType = req.body.accountType ? req.body.accountType : null;
        if (accountType == null) {
            res.status(500).send({
                message:
                  "accountType cannot be null"
              });
        }
        
        const industries = await industryService.createIndustries(id, industryNames, accountType)
        res.send(industries)
    } catch (err) {
        next(err)
    }
}

// middleware to get retail investor
exports.getRetailInvestor = (req, res, next) => {
    // console.log('industry controller >> get retail investor')
    const retailInvestorId = req.params.id
    try {
      const db = require("../models");
      const RetailInvestors = db.retailInvestors;
      
      const result = RetailInvestors.findByPk(retailInvestorId)
      .then(data => {
        req.body.retailInvestor = data
        // console.log('get retail investor >> data')
        // console.log(data)
        next();
      })
      .catch(err => {
        throw err    
      });
  } catch (error) {
      return error
  }
}

// Get a Preferred Industries with the specified retailinvestorId
exports.getIndustries = async (req, res) => {
    const retailInvestor = req.body.retailInvestor;
    const retailInvestorId = req.params.id;
    try {
      const result = await retailInvestor.getIndustryPreferences();
      if ( result.length != 0 ) {
        res.send(result)
      } else {
        res.status(500).send({
          message: `Cannot get Industries with retailInvestorId=${retailInvestorId}. Maybe Industries was not found or no industries set!`
        });
      }
      
    } catch (error) {
        console.log(error)
        return error
    }
    
  }