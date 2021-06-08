const AdminBro = require('admin-bro')
const AdminBroExpress = require('@admin-bro/express')

const express = require('express')


const adminBro = new AdminBro({
  databases: [],
  rootPath: '/admin',
})

const adminRouter = AdminBroExpress.buildRouter(adminBro)

module.exports = {
    adminBro, adminRouter
}