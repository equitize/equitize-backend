const app = require("../../app")
const supertest = require('supertest')
const  db  = require("../models/index")
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// this is an eg. of one test suite. 
describe('Startup Creation', () => {
  let thisDb = db
  beforeEach(async () => {
    await thisDb.sequelize.sync({ force: true })
  });

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
  });
  afterAll(async () => {
    await thisDb.sequelize.close()
  });

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