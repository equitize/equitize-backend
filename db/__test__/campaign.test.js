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

  // it('create retailInvestor', async() => {
  //   let requestBody = {
  //     firstName:investor_name,
  //     lastName:investor_name,
  //     emailAddress:investor_emailAddress,
  //     password:investor_password,
  //     singPass:"singPass",
  //     incomeStatement:"incomeStatement",
  //     incomeTaxReturn:"incomeTaxReturn"
  //   }
  //   let res = await supertest(app)
  //                         .post("/api/db/retailInvestors")
  //                         .send(requestBody)
  //   retailInvestor_id = res.body.retailInv.id
  //   retailInvestor_access_token = res.body.auth0.access_token
  //   expect(res.statusCode).toBe(200)
  // });

  // it('create campaign by update', async() => {
  //   requestBody = {
  //     tokensMinted:0.20,
  //   }
  //   res = await supertest(app)
  //                         .put(`/api/db/startup/campaign/update/${companyId}`)
  //                         .auth(company_access_token, { type: 'bearer' })
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  // });
  // // maybe should test creating campaign without valid companyId 

  // // currently allowing startup to create multiple campaign at the same time
  // // not doing this because we assume one startup can only have one campaign
  // // it('create campaign with duplicate info', async() => {
  // //   let requestBody = {
  // //     startupId:companyId,
  // //     goal:goal,
  // //     endDate:endDate
  // //   }
  // //   let res = await supertest(app)
  // //                         .post("/api/db/campaign")
  // //                         .send(requestBody)
  // //   expect(res.statusCode).toBe(200)  // currently allowed
  // //   retailInvestor_id = res.body.id    
  // // });

  // it('get a campaign by id', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .get(`/api/db/campaign/${companyId}`)
  //                         .auth(company_access_token, { type: 'bearer' })
  //                         .send(requestBody)
  //   expect(res.body.id).toBe(companyId)
  //   expect(res.statusCode).toBe(200)
  // });

  // it('get a campaign by id but invalid', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .get(`/api/db/campaign/${invalid_id}`)
  //                         .auth(company_access_token, { type: 'bearer' })
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(500)
  // });

  // // it('get all campaigns', async() => {
  // //   requestBody = {}
  // //   res = await supertest(app)
  // //                         .get("/api/db/campaign")
  // //                         .send(requestBody)
  // //   expect(res.body.length).toBe(1)
  // //   expect(res.statusCode).toBe(200)
  // // });

  // it('get campaign by company id', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .get(`/api/db/campaign/campaign/${companyId}`)
  //                         .auth(company_access_token, { type: 'bearer' })
  //                         .send(requestBody)
  //   expect(res.body.length).toBe(1)  // including duplicate
  //   expect(res.statusCode).toBe(200)
  // });

  // it('get campaign by company id but invalid', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .get(`/api/db/campaign/campaign/${invalid_id}`)
  //                         .auth(company_access_token, { type: 'bearer' })
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(500)
  // });

  // // // it('update campaign details', async() => {
  // // //   requestBody = {
  // // //     tokensMinted:0.30,
  // // //   }
  // // //   res = await supertest(app)
  // // //                         .put(`/api/db/startup/campaign/update/${companyId}`)
  // // //                         .send(requestBody)
  // // //   expect(res.statusCode).toBe(200)
  // // // });

  // it('update campaign details but invalid id', async() => {
  //   requestBody = {
  //     tokensMinted:0.30,
  //   }
  //   res = await supertest(app)
  //                         .put(`/api/db/startup/campaign/update/${invalid_id}`)
  //                         .auth(company_access_token, { type: 'bearer' })
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(404)
  // });

  // it('delete campaign by id but invalid id', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .delete(`/api/db/campaign/${invalid_id}`)
  //                         .auth(company_access_token, { type: 'bearer' })
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(500)
  // });

  // // not implemented maybe
  // it('delete campaign by id', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .delete(`/api/db/campaign/${campaign_id}`)
  //                         .auth(company_access_token, { type: 'bearer' })
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  // });

  // // it('delete campaign by id but already deleted', async() => {
  // //   requestBody = {}
  // //   res = await supertest(app)
  // //                         .delete(`/api/db/campaign/${campaign_id}`)
  // //                         .send(requestBody)
  // //   expect(res.statusCode).toBe(500)
  // // });

  // it('delete all campaigns', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .delete(`/api/db/campaign/`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  // });

  afterAll(async () => {
    await thisDb.sequelize.drop();
    await thisDb.sequelize.close()
  })
})
