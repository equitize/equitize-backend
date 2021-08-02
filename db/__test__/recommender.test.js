const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")

require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

// this is an eg. of one test suite. 
describe('Testing Recommender System', () => {
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

  const retailInvestor_name = uuid.v4().substring(0,8);
  const emailAddress = `${retailInvestor_name}@email.com`
  const userPassword = 'testPassword!@#$123'
  const interestedIndustries = [
    {"name":"Finance", "id":1},
    {"name":"Environment", "id":2}
  ]
  // const startup_csv_path = `${__dirname}/sample_files/startups.csv`

  const invalid_id = 1000000007

  let retailInvestor_id
  let retailInvestor_access_token
  let startupCount = 0


  // initialise retailInvestor
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
    retailInvestor_id = res.body.retailInv.id    
    retailInvestor_access_token = res.body.auth0.access_token
  });

  // assign interested industries to retailInvestor
  it('update interested industries', async() => {
    requestBody = {
      industryArr:interestedIndustries,
      accountType:"retailInvestor"
    }
    res = await supertest(app)
                          .post(`/api/db/retailInvestors/industries/addIndustries/${retailInvestor_id}`)
                          .auth(retailInvestor_access_token, { type: 'bearer' })
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('load all startups', async() => {
    requestBody = {"skip_upload_photos": true}  // for faster loading
    let res = await supertest(app)
                          .post("/api/db/misc/loadStartups")
                          .send(requestBody)
  }, 10000);

  // it('get all companies', async() => {
  //   requestBody = {}
  //   let res = await supertest(app)
  //                         .get("/api/db/startup")
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  //   startupCount = res.body.length
  // });

  // it('get recommendations but invalid id', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .get(`/api/db/retailInvestors/recommender/${invalid_id}`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(500)
  // });

  // it('get recommendations', async() => {
  //   requestBody = {
  //     fullInfo:null
  //   }
  //   res = await supertest(app)
  //                         .get(`/api/db/retailInvestors/recommender/${retailInvestor_id}`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  //   expect(res.body.length).toBe(startupCount)
  // });

  // it('get recommendations full info', async() => {
  //   requestBody = {
  //     fullInfo:true
  //   }
  //   res = await supertest(app)
  //                         .get(`/api/db/retailInvestors/recommender/${retailInvestor_id}`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  //   expect(res.body.length).toBe(startupCount)
  // });

  afterAll(async () => {
    await thisDb.sequelize.drop();
    await thisDb.sequelize.close()
  })
})
