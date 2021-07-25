module.exports = {
    auth0_config: {
        roles: {
            admin: "rol_1Lw0REn5fa5c5tLr",
            retail: "rol_N3PSCpEkeuh9mqdo",
            startup: "rol_vIfCrCeBWu6QlwDR",
        },
        perms: {
            startupVerified: "startup:verified", 
            retailInvestorVerified: "retailInvestor:verified",
            startupUnverified: "startup:unverified",
            retailInvestorUnverified: "retailInvestor:unverified"
        },
        superPerms: {
            admin: "admin:all"
        },
        adminUID: "auth0|60fd6d77cc74e6006a0acf8d"
    }
}