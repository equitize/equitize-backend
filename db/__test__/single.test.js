const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// retired
// see startup test
describe('Testing [/api/db/campaign]', () => {
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
  var uuid = require("uuid");

  const companyName = uuid.v4().substring(0,8);
  const company_emailAddress = `company-${companyName}@email.com`
  const companyPassword = 'testPassword!@#$123'

  const investor_name = uuid.v4().substring(0,8);
  const investor_emailAddress = `${investor_name}@email.com`
  const investor_password = 'testPassword!@#$123'

  const goal = 123456
  const goal_new = 987654
  const endDate = "datestring"
  
  const invalid_id = 1000000007

  let companyId
  let retailInvestor_id
  let campaign_id
  let retailInvestor_access_token
  let company_access_token
  let admin_access_token

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
    companyId = res.body.startup.id    
    company_access_token = res.body.auth0.access_token
    expect(res.statusCode).toBe(200)
  });

  afterAll(async () => {
    await thisDb.sequelize.drop();
    await thisDb.sequelize.close()
  })
})
