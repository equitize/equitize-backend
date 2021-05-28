const supertest = require('supertest')
// require('iconv-lite').encodingExists('foo')
const { app } = require("../../app")
const iconv =require('iconv-lite');
const encodings =  require('iconv-lite/encodings');
iconv.encodings = encodings;
// const { db } = require("../models/index")
// const { Startup } = require("../controllers/startup.controller")

// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
  })

describe('Initial Test', () => {
    it('should test that 1 + 1 === 2', async() => {
          const company_name = 'equitize'
          const email_address = `company-${company_name}@email.com`
          const password = `password`
          const requestBody ={
            company_name:company_name,
            email_address:email_address,
            password:password
          }
          const response = await supertest(app)
                                .post("/api/db/startup")
                                .send(requestBody)
          expect(res.statusCode).toEqual(200)
    })
})


// describe("test create startup", () => {
//   // Set the db object to a variable which can be accessed throughout the whole test file
//   let thisDb = db

//   // Before any tests run, clear the DB and run migrations with Sequelize sync()
//   beforeAll(async () => {
//     await thisDb.sequelize.sync({ force: true })
//   })

//   it("should succeed in creating startup when supplying company_name, email_address, company_password", async () => {
//     const startup = new Startup()
//     const company_name = 'equitize'
//     const email_address = `company-${company_name}@email.com`
//     const password = `password`

//     const { createParam } = await startup.create({ company_name, email_address, password })
//     console.log(createParam)
//     const requestBody ={
//         company_name:company_name,
//         email_address:email_address,
//         password:password
//     }

//     // App is used with supertest to simulate server request
//     const response = await supertest(app)
//       .post("/api/db/startup")
//       .send(requestBody)
//       .expect(200)
//     console.log(response.body)
//     // expect(response.body.company_name).toMatchObject({
//     //   success: true,
//     // })
//   })



//   // After all tersts have finished, close the DB connection
//   afterAll(async () => {
//     await thisDb.sequelize.close()
//   })
// })