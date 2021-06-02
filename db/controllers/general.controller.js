const generalService = require("../services/general.service");
module.exports = {
    getDocuments: function (req, res, next) {
        try {
            console.log('[DEV] : Get General Documents API reached')
            // TODO: get the 3 links from Cloud Storage
            // - Investment Guide
            // - Campaign Process Guide
            // - T&Cs
            // format links into json body and sennd
            const data = generalService.getDocuments()
            res.send(data)
        } catch (error){
            next(error)
        };
    }
}