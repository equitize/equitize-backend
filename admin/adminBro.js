const AdminBro = require('admin-bro')
const AdminBroSequelize = require('@admin-bro/sequelize')
const db = require('../db/models');

// const adminRouter = AdminBroExpress.buildRouter(adminBro)
AdminBro.registerAdapter(AdminBroSequelize)


const startupNav = {name: "startups", icon: "Enterprise"} 
const retailInvestorsNav = {name: "retailInvestors", icon: "User"} 
const campaignNav = {name: "campaign", icon: "Portfolio"} 
const junctionTableNav = {name: "junctionTable", icon: "testicon"} 
const commercialChampionNav = {name: "commercialChampion", icon: "Portfolio"} 
const milestoneNav = {name: "milestone", icon: "TagTag"} 

module.exports = {
  resources: [
    { resource: db.sequelize.models.startups, options: { navigation: startupNav } },
    { resource: db.sequelize.models.retailInvestors, options: { navigation: retailInvestorsNav } },
    { resource: db.sequelize.models.campaign, options: { navigation: campaignNav } },
    { resource: db.sequelize.models.junctionTable, options: { navigation: junctionTableNav } },
    { resource: db.sequelize.models.commercialChampion, options: { navigation: commercialChampionNav } },
    { resource: db.sequelize.models.milestone, options: { navigation: milestoneNav } },
  ],
  branding: {
    companyName: 'Equitize Inc.',
    softwareBrothers: false,
  },
  // pages: {
  //   customPage: {
  //     label: "Custom page",
  //     handler: async (request, response, context) => {
  //       return {
  //         text: 'I am fetched from the backend',
  //       }
  //     },
  //     // component: AdminBro.bundle('./components/some-stats'),
      
  //   },
  // },
  locale: {
    translations: {
      messages: {
        loginWelcome: "to Equitize Inc. Backend Server"
      }
    }
  },
  // dashboard:{
  //   component: AdminBro.bundle('./components/mainPage')
  // },
}