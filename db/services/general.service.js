module.exports = {
    getDocuments : function () {
        try {
            // TODO: get the 3 links from Cloud Storage
            // - Investment Guide
            // - Campaign Process Guide
            // - T&Cs
            // format links into json body and sennd
            data = {
                "Investment Guide": "investmentguide.txt",
                "Campaign Process Guide": "campaignprocessguide.txt",
                "T&Cs" : "terms&conditions.txt" 
            }
            return data
        } catch (error) {
            return error
        }
    }
}