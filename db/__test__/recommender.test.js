const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
const fs = require('mz/fs');

require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// this is an eg. of one test suite. 
describe('Testing Recommender System', () => {
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

  const retailInvestor_name = 'kenny'
  const emailAddress = `${retailInvestor_name}@email.com`
  const userPassword = 'password'
  const interestedIndustries = ["Finance", "Tech", "Farming"]

  let retailInvestor_id

  // initialise companies from list and assign industries
  it('create company', async() => {
    let requestBody = {
      companyName:"TBC",
      emailAddress:"TBC",
      companyPassword:"TBC"
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    company_id = res.body.id    
  });

  // initialise retailInvestor
  it('create retailInvestor', async() => {
    let requestBody = {
      firstName:retailInvestor_name,
      emailAddress:emailAddress,
      userPassword:userPassword
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    retailInvestor_id = res.body.id    
  });

  // assign interested industries to retailInvestor
  it('update interested industries', async() => {
    requestBody = {
      "industryNames":interestedIndustries,
      "id":retailInvestor_id,
      "accountType":"retailInvestor"
    }
    res = await supertest(app)
                          .post(`/api/db/retailInvestors/industries/addIndustries/`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  // get recommendations
  it('get interested industries', async() => {
    requestBody = {
    }
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/industries/getIndustries/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.body.length).toBe(Object.keys(interestedIndustries).length)
    expect(res.statusCode).toBe(200)
  });

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
