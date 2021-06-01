const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// this is an eg. of one test suite. 
describe('Startup Creation', () => {
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

  it('Testing startup creation API [/api/db/startup]', async() => {
    let requestBody = {
      company_name:company_name,
      email_address:email_address,
      company_password:company_password
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    const company_id = res.body.id    
  });

  it('Testing startup creation API [/api/db/startup] with missing info', async() => {
    let requestBody = {
      company_name:company_name,
      email_address:email_address,
      // company_password:company_password  // info missed
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(400)
  });

  it('Testing startup creation API [/api/db/startup] with duplicate info', async() => {
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

  it('Testing startup creation API [/api/db/startup] with different info', async() => {
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

  it('Testing get all', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get("/api/db/startup")
                          .send(requestBody)
    expect(res.body.length).toBe(2)
    expect(res.statusCode).toBe(200)
  });

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})

// describe("test create startup with db", () => {
//   // Set the db object to a variable which can be accessed throughout the whole test file
//   let thisDb = db

//   // Before any tests run, clear the DB and run migrations with Sequelize sync()
//   beforeAll(async () => {
//     await thisDb.sequelize.sync({ force: true })
//   })

//   it("Description of test", async () => {
//     // add yr test here
//   })

//   // After all tersts have finished, close the DB connection
//   afterAll(async () => {
//     await thisDb.sequelize.close()
//   });
// })