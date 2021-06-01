const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// this is an eg. of one test suite. 
describe('Testing [/api/db/startup]', () => {
  let thisDb = db
  
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
  });

  const retailInvestor_name = 'kenny'
  const email_address = `${retailInvestor_name}@email.com`
  const user_password = 'password'
  const retailInvestor_name_alt = 'francisco'
  const email_address_alt = `investor-${retailInvestor_name_alt}@email.com`
  const user_password_alt = 'password'
  const email_address_new = `investor2-${retailInvestor_name_alt}@email.com`
  let retailInvestor_id
  let invalid_string = 'sample_invalid_string'

  it('create retailInvestor', async() => {
    let requestBody = {
      first_name:retailInvestor_name,
      email_address:email_address,
      user_password:user_password
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    retailInvestor_id = res.body.id    
  });

  it('create retailInvestor with missing info', async() => {
    let requestBody = {
      first_name:retailInvestor_name_alt,
      email_address:email_address_alt,
      // user_password:user_password_alt
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(400)
  });

  it('create retailInvestor with duplicate info', async() => {
    let requestBody ={
      first_name:retailInvestor_name,  // duplicate_info
      email_address:email_address,  // duplicate_info
      user_password:user_password
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('create retailInvestor with different info', async() => {
    let requestBody = {
      first_name:retailInvestor_name_alt,
      email_address:email_address_alt,
      user_password:user_password_alt
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
                          .get(`/api/db/retailInvestors/${invalid_string}`)
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
                          .get(`/api/db/retailInvestors/email/${email_address}`)
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

  it('update details', async() => {
    requestBody = {
      email_address:email_address_new,
    }
    res = await supertest(app)
                          .put(`/api/db/retailInvestors/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('update details to duplicate', async() => {
    requestBody = {
      email_address:email_address_alt,
    }
    res = await supertest(app)
                          .put(`/api/db/retailInvestors/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('update details but invalid id', async() => {
    requestBody = {
      email_address:email_address,
    }
    res = await supertest(app)
                          .put(`/api/db/retailInvestors/${invalid_string}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete by id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/retailInvestors/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('delete by id but already deleted', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/retailInvestors/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete all', async() => {
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
