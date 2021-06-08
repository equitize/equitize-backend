const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')
const AdminBroSequelize = require('@admin-bro/sequelize')


const express = require('express')

const adminBro = new AdminBro({
  databases: [],
  rootPath: '/admin',
})


const adminRouter = AdminBroExpress.buildRouter(adminBro);
module.exports = { adminRouter, adminBro }