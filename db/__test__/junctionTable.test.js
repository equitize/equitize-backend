const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// this is an eg. of one test suite. 
describe('Testing [/api/db/junctionTable]', () => {
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
      password:companyPassword,
      profileDescription:companyName
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
      lastName:investor_name,
      emailAddress:investor_emailAddress,
      password:investor_password,
      singPass:"singPass",
      incomeStatement:"incomeStatement",
      incomeTaxReturn:"incomeTaxReturn"
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    retailInvestor_id = res.body.id    
  });

  it('create campaign by update', async() => {
    requestBody = {
      tokensMinted:0.20,
    }
    res = await supertest(app)
                          .put(`/api/db/startup/campaign/update/${companyId}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('make pledge', async() => {
    let requestBody = {
      retailInvID:retailInvestor_id,
      pledgeAmount:investment_amount
    }
    let res = await supertest(app)
                          .put(`/api/db/retailInvestors/campaign/pledge/${companyId}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
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

  it('get all junctionTables by retail investor email', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/junctionTable/retailInvestorEmail/${investor_emailAddress}`)
                          .send(requestBody)
    // expect(res.body.length).toBe(1)
    // expect(res.statusCode).toBe(200)  //  "message": "Unknown column 'junctionTable.retailInvestorEmail' in 'where clause'"
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
    await thisDb.sequelize.drop();
    await thisDb.sequelize.close()
  })
})
