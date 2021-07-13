const retailInvLogService = require("../services/retailInvLog.service");

module.exports = {
    findAll : (req, res, next) => {
        try {
            retailInvLogService.findAll()
            .then(function (data) {
                if (data.length == 0) {
                    res.status(404).send({
                        message: "No RetailInvestor Request Logs in DB"
                    }) 
                }
                else {
                    res.send(data);
                }
            })
            .catch(function (err) {
                res.status(500).send({
                    message:
                    err.message || "Some error occurred while retreiving RetailInvestor Request Logs."
                })
            });
        } catch (error) {
            next(error);
        }
    }
}