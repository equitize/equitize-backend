const startupService = require("../services/startup.service");

exports.getAndSortStartups = async (req, res) => {
    const retailInvestor = req.body.retailInvestor;
    const industries = await retailInvestor.getIndustryPreferences();
    const startups = await startupService.findAll();
    console.log(industries)
    console.log(startups.length)
    res.send(startups)
}
