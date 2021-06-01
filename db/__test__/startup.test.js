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

  const company_name = 'equitize'
  const email_address = `company-${company_name}@email.com`
  const company_password = 'password'
  const company_name_alt = 'tesla_motors'
  const email_address_alt = `company-${company_name_alt}@email.com`
  const company_password_alt = 'password'
  const company_name_new = 'tesla_motors2'
  const invalid_string = 'sample_invalid_string'
  let company_id

  it('create company', async() => {
    let requestBody = {
      company_name:company_name,
      email_address:email_address,
      company_password:company_password
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    company_id = res.body.id    
  });

  it('create company but missing info', async() => {
    let requestBody = {
      company_name:company_name_alt,
      email_address:email_address_alt,
      // company_password:company_password_alt  // info missed
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(400)
  });

  it('create company but duplicate info', async() => {
    let requestBody ={
      company_name:company_name,  // duplicate info
      email_address:email_address,  // duplicate info
      company_password:company_password
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('create startup with different info', async() => {
    let requestBody = {
      company_name:company_name_alt,
      email_address:email_address_alt,
      company_password:company_password_alt
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('get a company by id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/${company_id}`)
                          .send(requestBody)
    expect(res.body.id).toBe(company_id)
    expect(res.statusCode).toBe(200)
  });

  it('get a company by id but invalid', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/${invalid_string}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('get all companies', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get("/api/db/startup")
                          .send(requestBody)
    expect(res.body.length).toBe(2)
    expect(res.statusCode).toBe(200)
  });

  it('get by company name', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/company_name/${company_name}`)
                          .send(requestBody)
    expect(res.body.length).toBe(1)
    expect(res.statusCode).toBe(200)
  });

  it('get by company name but invalid', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/company_name/${invalid_string}`)
                          .send(requestBody)
    // expect(res.statusCode).toBe(500)
  });

  it('get by company email', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/email/${email_address}`)
                          .send(requestBody)
    // expect(res.body.length).toBe(1)
    expect(res.statusCode).toBe(200)
  });

  it('get by company email but invalid', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/email/${invalid_string}`)
                          .send(requestBody)
    // expect(res.statusCode).toBe(500)
  });

  it('update company details', async() => {
    requestBody = {
      company_name:company_name_new,
    }
    res = await supertest(app)
                          .put(`/api/db/startup/${company_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('update company details to duplicate', async() => {
    requestBody = {
      company_name:company_name_alt,
    }
    res = await supertest(app)
                          .put(`/api/db/startup/${company_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('update company details but invalid id', async() => {
    requestBody = {
      company_name:company_name,
    }
    res = await supertest(app)
                          .put(`/api/db/startup/${invalid_string}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete company by id but invalid id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/startup/${invalid_string}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete company by id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/startup/${company_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('delete company by id but already deleted', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/startup/${invalid_string}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete all companies', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/startup/`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
