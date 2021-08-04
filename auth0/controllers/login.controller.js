const { default: axios } = require('axios');
const createHttpError = require('http-errors');

module.exports = {
    createStartupLogin : async (req, res, next) => {
        // login after create startup API endpoint. 
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
            if ( accessToken.status === 200) res.send({ 
                startup : req.body.startup,
                auth0 : accessToken.data
            })
            else if ( accessToken.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
            else {
                throw createHttpError[500];
            }
        } catch (error) {
            next(error);
        }
    },
    createRetailInvLogin : async (req, res, next) => {
        // login after create retailInv endpoint
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
            
            if ( accessToken.status === 200) {
                res.send({
                    retailInv : req.body.retailInv,
                    auth0 : accessToken.data
            }); }
            else if ( accessToken.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
            else {
                throw createHttpError[500];
            }
        } catch (error) {
            next(error);
        }
    },
    createAdminLogin : async (req, res, next) => {
        // login after create admin endpoint
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
            
            if ( accessToken.status === 200) {
                res.send({
                    auth0 : accessToken.data
            }); }
            else if ( accessToken.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
            else {
                throw createHttpError[500];
            }
        } catch (error) {
            next(error);
        }
    },
    retailInvLogin : async (req, res, next) => {
        // login retailInv endpoint
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
            if ( accessToken.status === 200 ) {
                req.body.accessToken = accessToken.data
                next()
            }
            else if ( accessToken.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
            else {
                throw createHttpError[500];
            }
        } catch (error) {
            next(error);
        }
    },
    startupLogin : async (req, res, next) => {
        // login startup API endpoint. 
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
            if ( accessToken.status === 200 ) { 
                req.body.accessToken = accessToken.data
                next()
            }
            else if ( accessToken.status === 403 ) throw createHttpError[403]; // hide error sent to frontend
            else {
                throw createHttpError[500];
            }
        } catch (error) {
            next(error);
        }
    },
} 