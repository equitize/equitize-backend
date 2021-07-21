const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const jwtAuthz = require("express-jwt-authz");
const { auth0_config : { perms, superPerms } } = require('../utils/auth0_config');
require('dotenv').config({
    path: `${__dirname}/../../.env`
});

module.exports = {
    authorizeAccessToken : jwt({
        secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
        }),
        audience: 'BackendAPI',
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"]
    }),
    checkStartupKYCUnverified : jwtAuthz([perms.startupUnverified, perms.startupVerified], { // routes should still be accessible after KYC-verification
        customScopeKey: "permissions",
        // checkAllScopes: true,
        failWithError: true
    }),
    checkStartupKYCUnverifiedretailInvVerified : jwtAuthz([perms.startupUnverified, perms.startupVerified, perms.retailInvestorVerified], { // routes should still be accessible after KYC-verification
        customScopeKey: "permissions",
        // checkAllScopes: true,
        failWithError: true
    }),
    checkStartupKYCverified : jwtAuthz([perms.startupVerified], {
        customScopeKey: "permissions",
        checkAllScopes: true,
        failWithError: true
    }),
    checkretailKYCUnverified : jwtAuthz([perms.retailInvestorUnverified, perms.retailInvestorVerified], { // routes should still be accessible after KYC-verification
        customScopeKey: "permissions",
        // checkAllScopes: true,
        failWithError: true
    }),
    checkretailKYCverified : jwtAuthz([perms.retailInvestorVerified], {
        customScopeKey: "permissions",
        checkAllScopes: true,
        failWithError: true
    }),
    checkAdmin : jwtAuthz([superPerms.admin], {
        customScopeKey: "permissions",
        checkAllScopes: true,
        failWithError: true
    })
}
