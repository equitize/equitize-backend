const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// this is an eg. of one test suite. 
describe('Testing [/api/db/campaign]', () => {
  let thisDb = db
  
  beforeAll(async () => {
    for (attemptCount in [...Array(10).keys()]){
      try {
        console.log("attempt at database sync", attemptCount)
        await thisDb.sequelize.sync({force: false});
      } catch {
        continue
      }
      break
    }
  });

  const companyName = 'equitize'
  const company_emailAddress = `company-${companyName}@email.com`
  const companyPassword = 'password'

  const investor_name = 'kenny'
  const investor_emailAddress = `${investor_name}@email.com`
  const investor_password = 'password'

  const goal = 123456
  const endDate = "datestring"

  const investment_amount = 1234
  const investment_amount_new = 2345
  
  const invalid_id = 1000000007
  
  let companyId
  let retailInvestor_id
  let campaign_id
  let junctionTable_id

  it('create company', async() => {
    let requestBody = {
      companyName:companyName,
      emailAddress:company_emailAddress,
      companyPassword:companyPassword
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    companyId = res.body.id    
  });

  it('create retailInvestor', async() => {
    let requestBody = {
      firstName:investor_name,
      emailAddress:investor_emailAddress,
      userPassword:investor_password
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    retailInvestor_id = res.body.id    
  });

  it('create campaign', async() => {
    let requestBody = {
      companyId:companyId,
      goal:goal,
      endDate:endDate
    }
    let res = await supertest(app)
                          .post("/api/db/campaign")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    campaign_id = res.body.id    
  });

  // TODO: note that the investment is made on companyId, not campaign_id, not sure if intended
  // TODO: does not validate if the investment amount has been reached
  it('create junctionTable', async() => {
    let requestBody = {
      retailInvestorId:retailInvestor_id,
      companyId:companyId,
      amount:investment_amount
    }
    let res = await supertest(app)
                          .post("/api/db/junctionTable")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    junctionTable_id = res.body.id    
  });

  // negative cases of above

  it('get a junctionTable by id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/junctionTable/${junctionTable_id}`)
                          .send(requestBody)
    expect(res.body.id).toBe(companyId)
    expect(res.statusCode).toBe(200)
  });

  it('get all junctionTables', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/junctionTable/`)
                          .send(requestBody)
    expect(res.body.length).toBe(1)
    expect(res.statusCode).toBe(200)
  });

  // TODO: does not validate if the investment amount has been reached
  it('update junctionTable details', async() => {
    requestBody = {
      amount:investment_amount_new
    }
    res = await supertest(app)
                          .put(`/api/db/junctionTable/${junctionTable_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  // negative example of above

  it('delete junctionTable by id but invalid id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/junctionTable/${invalid_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete junctionTable by id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/junctionTable/${junctionTable_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('delete junctionTable by id but already deleted', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/junctionTable/${junctionTable_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete all junctionTables', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/junctionTable/`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
