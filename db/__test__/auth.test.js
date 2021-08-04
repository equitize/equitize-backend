const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
const fs = require('mz/fs');

require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');

var uuid = require("uuid");

const companyName = uuid.v4().substring(0,8);
const company_emailAddress = `company-${companyName}@email.com`
const companyPassword = 'testPassword!@#$123'

const investor_name = uuid.v4().substring(0,8);
const investor_emailAddress = `${investor_name}@email.com`
const investor_password = 'testPassword!@#$123'

let companyId
let retailInvestor_id
let admin_access_token

// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// this is an eg. of one test suite. 
describe('Testing [/api/db/startup]', () => {
  let thisDb = db
  
  beforeAll(async () => {
    for (attemptCount in [...Array(10).keys()]){
      try {
        // https://stackoverflow.com/a/21006886/5894029
        // await thisDb.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
        // console.log("attempt at database sync", attemptCount)
        // await thisDb.sequelize.sync({force: true});
        // await thisDb.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
        // https://stackoverflow.com/a/53236489/5894029
        await thisDb.sequelize.sync({force: false, alter : true});
    } catch {
        continue
      }
      break
    }
  });

  it('create company', async() => {
    let requestBody = {
      companyName:companyName,
      emailAddress:company_emailAddress,
      password:companyPassword,
      profileDescription:companyName
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    // companyId = res.body.startup.id    
  });

  it('login company', async() => {
    let requestBody = {
      emailAddress:company_emailAddress,
      password:companyPassword
    }
    let res = await supertest(app)
                          .post("/api/db/startup/login")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  })

  it('create retailInvestor', async() => {
    let requestBody = {
      firstName:investor_name,
      lastName:investor_name,
      emailAddress:investor_emailAddress,
      password:investor_password,
      singPass:"singPass",
      incomeStatement:"incomeStatement",
      incomeTaxReturn:"incomeTaxReturn"
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors/")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    // retailInvestor_id = res.body.id    
  });

  it('login retailInvestor', async() => {
    let requestBody = {
      emailAddress:investor_emailAddress,
      password:investor_password
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors/login")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  })

  it('get admin token', async() => {
    let requestBody = {
      emailAddress:process.env.AUTH0_ADMIN_USERNAME,
      password:process.env.AUTH0_ADMIN_PWD,
    }
    let res = await supertest(app)
                          .post("/admin")
                          .send(requestBody)
    admin_access_token = res.body.access_token
    expect(res.statusCode).toBe(200)
  });

  // it('drop auth0', async() => {
  //   let requestBody = {}
  //   let res = await supertest(app)
  //                         .post("/admin/auth0/dropUsers")
  //                         .auth(admin_access_token, { type: 'bearer' })
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  // });

  afterAll(async () => {
    await thisDb.sequelize.drop();
    await thisDb.sequelize.close()
  })
})
