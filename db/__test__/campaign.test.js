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
  const goal_new = 987654
  const endDate = "datestring"
  
  const invalid_id = 1000000007

  let companyId
  let retailInvestor_id
  let campaign_id

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
  // maybe should test creating campaign without valid companyId 

  it('create campaign but missing info', async() => {
    let requestBody = {
      // companyId:companyId, // info missed out
      // goal:goal,
      endDate:endDate 
    }
    let res = await supertest(app)
                          .post("/api/db/campaign")
                          .send(requestBody)
    expect(res.statusCode).toBe(400)
  });

  // currently allowing startup to create multiple campaign at the same time
  it('create campaign with duplicate info', async() => {
    let requestBody = {
      companyId:companyId,
      goal:goal,
      endDate:endDate
    }
    let res = await supertest(app)
                          .post("/api/db/campaign")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)  // currently allowed
    retailInvestor_id = res.body.id    
  });

  it('get a campaign by id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/campaign/${campaign_id}`)
                          .send(requestBody)
    expect(res.body.id).toBe(companyId)
    expect(res.statusCode).toBe(200)
  });

  it('get a campaign by id but invalid', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/campaign/${invalid_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('get all campaigns', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get("/api/db/campaign")
                          .send(requestBody)
    expect(res.body.length).toBe(2)
    expect(res.statusCode).toBe(200)
  });

  it('get by company id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/campaign/campaign/${companyId}`)
                          .send(requestBody)
    expect(res.body.length).toBe(2)  // including duplicate
    expect(res.statusCode).toBe(200)
  });

  it('get by company name but invalid', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/campaign/campaign/${invalid_id}`)
                          .send(requestBody)
    // expect(res.statusCode).toBe(500)
  });

  it('update campaign details', async() => {
    requestBody = {
      goal:goal_new,
    }
    res = await supertest(app)
                          .put(`/api/db/campaign/${campaign_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('update campaign details but invalid id', async() => {
    requestBody = {
      goal:goal_new,
    }
    res = await supertest(app)
                          .put(`/api/db/campaign/${invalid_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete campaign by id but invalid id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/campaign/${invalid_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete campaign by id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/campaign/${campaign_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('delete campaign by id but already deleted', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/campaign/${campaign_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete all campaigns', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/campaign/`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
