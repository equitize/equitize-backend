const app = require("../../app")
const supertest = require('supertest')
const  db  = require("../models/index")
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');
const { startup } = require("../controllers/startup.controller")


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
  })

it('gets the test endpoint', async () => {
  const response = await supertest(app).get('/test')

  expect(response.statusCode).toBe(200)
  expect(response.body.message).toBe('pass!')
  // done()
})

describe('Startup Creation', () => {
  it('Testing startup creation API [/api/db/startup]', async() => {
        const company_name = 'equitize'
        const email_address = `company-${company_name}@email.com`
        const company_password = 'password'
        const requestBody ={
          company_name:company_name,
          email_address:email_address,
          company_password:company_password
        }
        const res = await supertest(app)
                              .post("/api/db/startup")
                              .send(requestBody)
        expect(res.statusCode).toBe(200)
  })
})


describe("test create startup with db", () => {
  // Set the db object to a variable which can be accessed throughout the whole test file
  let thisDb = db

  // Before any tests run, clear the DB and run migrations with Sequelize sync()
  beforeAll(async () => {
    await thisDb.sequelize.sync({ force: true })
  })

  it("should succeed in creating startup when supplying company_name, email_address, company_password", async () => {
    // const startup = new startup
    const company_name = 'equitize'
    const email_address = `company-${company_name}@email.com`
    const company_password = `password`

    const { createParam } = await startup.create({ company_name, email_address, password })
    console.log(createParam)
    const requestBody ={
        company_name:company_name,
        email_address:email_address,
        company_password:company_password
    }

    // App is used with supertest to simulate server request
    const response = await supertest(app)
      .post("/api/db/startup")
      .send(requestBody)
      .expect(200)
    console.log(response.body)
    // expect(response.body.company_name).toMatchObject({
    //   success: true,
    // })
  })

  // After all tersts have finished, close the DB connection
  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})