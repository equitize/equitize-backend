// this is strictly for auth0 management APIs
const { default: axios } = require('axios');

module.exports = {
    getMgtToken: function (req, res, next) {
        try {
            const data = {
                "grant_type": "client_credentials",
                "client_id": `${process.env.AUTH0_CLIENT_ID_PDTN}`,
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
            var options = {
                method: 'POST',
                url: `https://${process.env.AUTH0_DOMAIN}/api/v2/roles/ROLE_ID/permissions`,
                headers: {
                'content-type': 'application/json',
                authorization: `${process.env.AUTH0_MGT_TOKEN_TESTING}`,
                'cache-control': 'no-cache'
                },
                data: {
                permissions: [
                    {
                    resource_server_identifier: 'API_IDENTIFIER',
                    permission_name: 'PERMISSION_NAME'
                    },
                    {
                    resource_server_identifier: `${process.env.AUTH0_AUDIENCE}`,
                    permission_name: 'PERMISSION_NAME'
                    }
                ]
                }
            };
            
            axios.request(options).then(function (response) {
            }).catch(function (error) {
                throw error
            });
        } catch (error) {
            next(error)
        }
    }
}