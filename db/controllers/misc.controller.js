const csv = require("csvtojson");
const startupService = require("../services/startup.service");
const industryService = require("../services/industry.service");
const { default: axios } = require("axios");
const FormData = require('form-data');
const fs = require('fs');


module.exports = {
    loadStartups: async (req, res, next) => {
        try {
            const startup_csv_path = `${__dirname}/../__test__/sample_files/startups.csv`
            const startups = await csv().fromFile(startup_csv_path);
            let records = [];
            let industriesPlaceholder = [];
            let acceptedStartupCount = 0;
            let avatars = [];
            for( [cnt, data] of Object.entries(startups) ) {
                if (!data.name || !data.url || !data.description || !data.avatar) {continue}
                let requestBody = {
                    companyName:data.name,
                    emailAddress:data.url,
                    password:cnt,  // mock
                    profileDescription:data.description,
                    auth0ID:data.auth0ID
                };
                acceptedStartupCount ++
                records.push(requestBody);
                if (!data.surveyed_industries) {data.surveyed_industries = "Others"} 
                industriesPlaceholder.push(data.surveyed_industries.split(","));
                avatars.push(data.avatar);
            }
            // Bulk Create Startups
            const createStatus = await startupService.bulkCreate(records);
            // Assign Industries
            const accountType = "startup"
            for (let id = 1; id < acceptedStartupCount+1; id++) {
                const assignIndustryStatus = await industryService.createIndustries(id, industriesPlaceholder[id-1], accountType);
                // upload profile photo
                if (req.body.skip_upload_photos){continue}
                let filepath = `${__dirname}/../__test__/sample_files/avatars/${avatars[id-1]}`
                let formData = new FormData();
                formData.append("file", fs.createReadStream(filepath));
                const result = await axios.put(`http://localhost:8080/api/db/startup/profilePhoto/${id}`, formData, 
                {headers: {
                    ...formData.getHeaders(),
                  }})
            }
            res.status(200).send({
                message : `Succesfully loaded ${acceptedStartupCount} startups, assigned industries to them and (if not skipped) added profile photos`
            })
        } catch (error) {
            next(error);
        }
    },
}