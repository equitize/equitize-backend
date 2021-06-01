const { default: axios } = require('axios');
const { auth0_config : { roles } } = require('../utils/auth0_config');

module.exports = {
    startup: (req, res, next) => {
        // res.send('register-startup')
        console.log('[DEV] : register-startup API Reached');
        // Assign Role to Account
        try {
            const user_id = encodeURIComponent(req.user_id);
            console.log(user_id);

            const data = {
                "roles": [ roles.startup ]
            };

            const headers = {
                "Content-Type": "application/json",
                "authorization": `Bearer ${process.env.AUTHO_MGT_TOKEN_TESTING}`
            };
            axios.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}/roles`, data, { headers : headers } )
            .then(function (response) {
                console.log('register startup response reached')
                console.log(response.status)
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
        console.log('[DEV] : register-retail-investor API Reached');
        // Assign Role to Account
        try {
            const user_id = encodeURIComponent(req.user_id);
            const data = {
                "roles": [ roles.retail ]
            };
            const headers = {
                "Content-Type": "application/json",
                "authorization": `Bearer ${process.env.AUTHO_MGT_TOKEN_TESTING}`
            };
            axios.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}/roles`, data, { headers : headers } )
            .then(function (response) {
                console.log(response.status)
            })
            .catch(function (error) {
                next(error);
            });
        } catch (error) {
            next(error);
        };
    },
    createAccount: function (req, res, next) {
        console.log('[DEV] : createAcc API Reached');
        // Uncomment when using production ready MGT Token from auth0
        // process.env.AUTHO_MGT_TOKEN_PRODUCTION=req.MGT_ACCESS_TOKEN
        try {
            const data = {
                "connection": "Username-Password-Authentication",
                "email": `${req.body.email_address}`,
                "password": `${req.body.company_password}`
            };
            const headers = {
                "Content-Type": "application/json",
                "authorization": `Bearer ${process.env.AUTHO_MGT_TOKEN_TESTING}`
            };
            axios.post(`https://${process.env.AUTH0_DOMAIN}/api/v2/users`, data , { headers : headers } )
            .then(function (response) {
                req.user_id = response.data.user_id;
                next();
            })
            .catch(function (error) {
                // console.log(error);
                console.log('alskdjfhalsdkjfhas')
                next(error);
            });
        } catch (error) {
            next(error);
        };
    },

}
