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
      emailAddress:emailAddress,
      userPassword:userPassword
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    retailInvestor_id = res.body.id    
  });

  it('create retailInvestor but missing info', async() => {
    let requestBody = {
      firstName:retailInvestor_name_alt,
      emailAddress:emailAddress_alt,
      // userPassword:userPassword_alt
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(400)
  });

  it('create retailInvestor but duplicate info', async() => {
    let requestBody ={
      firstName:retailInvestor_name,  // duplicate_info
      emailAddress:emailAddress,  // duplicate_info
      userPassword:userPassword
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('create retailInvestor with different info', async() => {
    let requestBody = {
      firstName:retailInvestor_name_alt,
      emailAddress:emailAddress_alt,
      userPassword:userPassword_alt
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
    await thisDb.sequelize.close()
  })
})
