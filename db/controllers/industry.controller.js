const industryService = require("../services/industry.service");

exports.create = async (req, res) => {
    try {
        const startupId = req.body.startupId
        const industryName = req.body.industryName
        const industry = await industryService.createIndustry(startupId, industryName)
        res.send(industry)
    } catch (err) {
        console.log(err)
    }
}