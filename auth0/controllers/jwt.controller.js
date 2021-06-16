const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const jwtAuthz = require("express-jwt-authz");

module.exports = {
    authorizeAccessToken : (req, res, next) => {
        try {            
            jwt({
            secret: jwksRsa.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
            }),
            audience: `${process.env.AUTH0_AUDIENCE}`,
            issuer: `https://${process.env.AUTH0_DOMAIN}/`,
            algorithms: ["RS256"]
            });
            next();
        } catch(err) {
            console.log('authorize access toekn')
            console.log(err)
        }
    },
    checkPermissions : (req, res, next) => {
        jwtAuthz(["role:protectedapi"], {
        customScopeKey: "permissions",
        checkAllScopes: true
        });
        next();
    }
}
