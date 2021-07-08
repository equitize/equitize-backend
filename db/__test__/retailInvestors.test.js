const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// this is an eg. of one test suite. 
describe('Testing [/api/db/retailInvestors]', () => {
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

  const retailInvestor_name = 'kenny'
  const emailAddress = `${retailInvestor_name}@email.com`
  const userPassword = 'password'
  const interestedIndustries = [
    {"name":"Finance", "id":1},
    {"name":"Tech", "id":2},
    {"name":"Farming", "id":3}
  ]
  const retailInvestor_name_alt = 'francisco'
  const emailAddress_alt = `investor-${retailInvestor_name_alt}@email.com`
  const userPassword_alt = 'password'
  
  const emailAddress_new = `investor2-${retailInvestor_name_alt}@email.com`

  const invalid_string = 'sample_invalid_string'
  const invalid_id = 1000000007

  let retailInvestor_id

  it('create retailInvestor', async() => {
    let requestBody = {
      firstName:retailInvestor_name,
      lastName:retailInvestor_name,
      emailAddress:emailAddress,
      password:userPassword,
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

  it('create retailInvestor but missing info', async() => {
    let requestBody = {
      firstName:retailInvestor_name,
      lastName:retailInvestor_name,
      // emailAddress:emailAddress,
      password:userPassword,
      singPass:"singPass",
      incomeStatement:"incomeStatement",
      incomeTaxReturn:"incomeTaxReturn"
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(400)
  });

  it('create retailInvestor but duplicate info', async() => {
    let requestBody = {
      firstName:retailInvestor_name,  // duplicate_info
      lastName:retailInvestor_name,
      emailAddress:emailAddress,  // duplicate_info
      password:userPassword,
      singPass:"singPass",
      incomeStatement:"incomeStatement",
      incomeTaxReturn:"incomeTaxReturn"
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('create retailInvestor with different info', async() => {
    let requestBody = {
      firstName:retailInvestor_name_alt,
      lastName:retailInvestor_name,
      emailAddress:emailAddress_alt,
      password:userPassword,
      singPass:"singPass",
      incomeStatement:"incomeStatement",
      incomeTaxReturn:"incomeTaxReturn"

    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('get a retailInvestor by id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.body.id).toBe(retailInvestor_id)
    expect(res.statusCode).toBe(200)
  });

  it('get a retailInvestor by id but invalid', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/${invalid_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('get all retailInvestors', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.body.length).toBe(2)
    expect(res.statusCode).toBe(200)
  });

  it('get by retailInvestor email', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/email/${emailAddress}`)
                          .send(requestBody)
    // expect(res.body.length).toBe(1)
    expect(res.statusCode).toBe(200)
  });

  it('get by retailInvestor email but invalid', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/email/${invalid_string}`)
                          .send(requestBody)
    // expect(res.statusCode).toBe(500)
  });

  it('update retailInvestor details', async() => {
    requestBody = {
      emailAddress:emailAddress_new,
    }
    res = await supertest(app)
                          .put(`/api/db/retailInvestors/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('update retailInvestor details to duplicate', async() => {
    requestBody = {
      emailAddress:emailAddress_alt,
    }
    res = await supertest(app)
                          .put(`/api/db/retailInvestors/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('update retailInvestor details but invalid id', async() => {
    requestBody = {
      emailAddress:emailAddress,
    }
    res = await supertest(app)
                          .put(`/api/db/retailInvestors/${invalid_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('update interested industries', async() => {
    requestBody = {
      industryArr:interestedIndustries,
      id:retailInvestor_id,
      accountType:"retailInvestor"
    }
    res = await supertest(app)
                          .post(`/api/db/retailInvestors/industries/addIndustries/`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('get interested industries', async() => {
    requestBody = {
    }
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/industries/getIndustries/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.body.length).toBe(Object.keys(interestedIndustries).length)
    expect(res.statusCode).toBe(200)
  });

  it('delete retailInvestor by id but invalid', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/retailInvestors/${invalid_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete retailInvestor by id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/retailInvestors/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('delete retailInvestor by id but already deleted', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/retailInvestors/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete all retailInvestors', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/retailInvestors/`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  afterAll(async () => {
    await thisDb.sequelize.drop();
    await thisDb.sequelize.close()
  })
})
