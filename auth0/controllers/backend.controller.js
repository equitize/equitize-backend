const { default: axios } = require('axios');

module.exports = {
    getMgtToken: function (req, res, next) {
        try {
            console.log('[DEV] : Get Management Token Middleware Reached')
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
                console.log('askldjhfaskldjfhalsdkj')
                req.MGT_ACCESS_TOKEN = MGT_ACCESS_TOKEN;
                next();
            })
            .catch(function (error) {
                console.log(error)
                next(error);
            });
        } catch (error) {
            next(error);
        };
    }
}