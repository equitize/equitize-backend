const { default: axios } = require('axios');
const createHttpError = require('http-errors');
const { auth0_config : { roles } } = require('../utils/auth0_config');

module.exports = {
    startup: (req, res, next) => {
        // Assign Role to Account
        try {
            const user_id = encodeURIComponent(req.user_id);

            const data = {
                "roles": [ roles.startupUnverified ]
            };

            const headers = {
                "Content-Type": "application/json",
                "authorization": `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`
            };
            axios.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}/roles`, data, { headers : headers } )
            .then(function (response) {
                next();
            })
            .catch(function (error) {
                next(error);
            });
        } catch (error) {
            next(error);
        };
    },
    retailInvestors: (req, res, next) => {
        // Assign Role to Account
        try {
            const user_id = encodeURIComponent(req.user_id);
            const data = {
                "roles": [ roles.retailUnverified ]
            };
            const headers = {
                "Content-Type": "application/json",
                "authorization": `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`
            };
            axios.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}/roles`, data, { headers : headers } )
            .then(function (response) {
                // console.log(response.status)
                next()
            })
            .catch(function (error) {
                next(error);
            });
        } catch (error) {
            next(error);
        };
    },
    createAccount: function (req, res, next) {
        // Uncomment when using production ready MGT Token from auth0
        // process.env.AUTHO_MGT_TOKEN_PRODUCTION=req.MGT_ACCESS_TOKEN
        try {
            const data = {
                "connection": "Username-Password-Authentication",
                "email": `${req.body.emailAddress}`,
                "password": `${req.body.password}`
            };
            const headers = {
                "Content-Type": "application/json",
                "authorization": `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`
            };
            axios.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, data , { headers : headers } )
            .then(function (response) {
                req.user_id = response.data.user_id;
                next();
            })
            .catch(function (error) {
                console.log(error)
                next(createHttpError[500])
            });
        } catch (error) {
            next(error);
        };
    },

}
