// this is strictly for auth0 management APIs
const { default: axios } = require('axios');
const createHttpError = require('http-errors');
const { auth0_config : { roles, perms, adminUID } } = require('../utils/auth0_config');

module.exports = {
    getMgtToken: function (req, res, next) {
        try {
            const data = {
                "grant_type": "client_credentials",
                "client_id": `${process.env.AUTH0_BACKEND_CLIENTID}`,
                "client_secret": `${process.env.AUTH0_CLIENT_SECRET_PDTN}`,
                "audience": `https://${process.env.AUTH0_DOMAIN}/api/v2/`
            };
            const headers = {
                "Content-Type": "application/json"
            };
            axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, data, { headers : headers } )
            .then(function (response) {
                const MGT_ACCESS_TOKEN = response.data.access_token;
                req.MGT_ACCESS_TOKEN = MGT_ACCESS_TOKEN;
                next();
            })
            .catch(function (error) {
                next(error);
            });
        } catch (error) {
            next(error);
        };
    },
    addPerms: function (req, res, next) {
        try {
            const user_id = encodeURIComponent(req.body.user_id); // NEED TO FIND UID (auth0)
            const specifiedPerms = req.body.addPerms ? req.body.addPerms : null;
            if (!specifiedPerms) throw createHttpError(500, "Please include permissions")
            if (!perms[specifiedPerms]) throw createHttpError(500, "Please include correct permissions {startupVerified, startupUnverified, retailInvestorVerified, retailInvestorUnverified}")
            var options = {
                method: 'POST',
                url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}/permissions`,
                // url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/auth0%7C60f25429eb6a3200687eb844/permissions`,
                // https://YOUR_DOMAIN/api/v2/users/USER_ID/permissions
                headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`,
                'cache-control': 'no-cache'
                },
                data: {
                permissions: [
                    {
                    resource_server_identifier: "BackendAPI",
                    permission_name: perms[specifiedPerms]
                    },
                ],
                }
            };
            
            axios.request(options).then(function (response) {
                req.body.addPermsFlag = true;
                next()
            }).catch(function (error) {
                throw error
            });
        } catch (error) {
            next(error)
        }
    },
    removePerms: function (req, res, next) {
        try {
            const user_id = encodeURIComponent(req.body.user_id); // NEED TO FIND UID (auth0)
            const specifiedPerms = req.body.removePerms ? req.body.removePerms : null;
            if (!specifiedPerms) throw createHttpError(500, "Please include permissions")
            if (!perms[specifiedPerms]) throw createHttpError(500, "Please include correct permissions {startupUnverified, retailInvestorUnverified}")
            const options = {
                method: 'DELETE',
                url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${user_id}/permissions`,
                headers: {
                  'content-type': 'application/json',
                  'authorization': `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`,
                  'cache-control': 'no-cache'
                },
                data: {
                  permissions: [
                    {resource_server_identifier: "BackendAPI", permission_name: perms[specifiedPerms]}, // TODO: Dynamically remove perms for startups/retail
                  ]
                }
              };
              axios.request(options).then(function (response) {
                req.body.removePermsFlag = true;
                next()
              }).catch(function (error) {
                throw error
              });
        } catch (error) {
            next(error)
        }
    },
    delAllUsers : async (req, res, next) => {
        try {
            const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

            var options = {
                method: 'GET',
                url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
                headers: {
                    authorization: `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`,
                },
            };
            const users = await axios.request(options); 
            if (!users) throw createHttpError(500, "Failed to get list of auth0 users") 
            const userIDArr = users.data.map(user => user.user_id) // get list of auth0 user_id
            userIDArr.forEach(async user_id => {
                if (user_id === adminUID) return;
                var options = {
                    method : 'DELETE',
                    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/` + encodeURIComponent(user_id),
                    headers: {
                        authorization: `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`,
                    },
                }
                const response = await axios.request(options) // .data returns ''
                if (response["headers"]["x-ratelimit-remaining"] === '0') { 
                    await sleep(1000) }
            });
            res.status(200).send({'message': 'succesfully removed all auth0 users'})
            
        } catch (error) {
            next(error)
        }
    },
    getUserByEmail: async function (req, res, next) {
        try {
            const email = encodeURIComponent(req.body.email)
            var options = {
                method: 'GET',
                url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users-by-email?email=${email}`,
                headers: {
                    authorization: `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`,
                },
            };
            axios.request(options)
            .then(user => {
                if (user.data.length === 0) {
                    res.send(`${user.data.length} found with email=${req.body.email}`)
                } else {
                    req.body.user_id = user.data[0].user_id;
                    next()
                }
            })
            .catch(error => {
                throw error
            })
            
        } catch (error) {
            next(error)
        }
    },
    getAdminToken : async (req, res, next) => {
        try {
            const url = `https://${process.env.AUTH0_DOMAIN}/oauth/token`;
            const data = {
                "grant_type": "http://auth0.com/oauth/grant-type/password-realm",
                "client_id": process.env.AUTH0_FRONTEND_CLIENTID,
                "audience": process.env.AUTH0_AUDIENCE,
                "username": req.body.emailAddress,
                "password": req.body.password,
                "realm": "Username-Password-Authentication"
            };
            const headers = {
                "Content-Type": "application/json",
                "authorization": `Bearer ${process.env.AUTH0_MGT_TOKEN_TESTING}`
            };
            const accessToken = await axios.post(url, data, { headers : headers });
            // console.log(accessToken)
            if ( accessToken.status === 200) { 
                res.send(accessToken.data)
            }
            else if ( accessToken.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
            else {
                throw createHttpError[500];
            }
        } catch (error) {
            next(error);
        }
    }
}