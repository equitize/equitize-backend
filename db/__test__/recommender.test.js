const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
const fs = require('mz/fs');

require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');


// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})

describe('Load a dummy startup', () => {

  var uuid = require("uuid");
  var uuid_string = uuid.v4().substring(0,8);
  
  const companyName = uuid_string
  const emailAddress = `company-${companyName}@email.com`
  const companyPassword = 'testPassword!@#$123'
  const companyIndustries = [
    // {"name":"Finance", "id":1},
    // {"name":"Environment", "id":2},
  ]

  let company_id
  let company_access_token
  let admin_access_token


  it('create company', async() => {
    let requestBody = {
      companyName:companyName,
      emailAddress:emailAddress,
      password:companyPassword,
      profileDescription:companyName
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    company_id = res.body.startup.id
    company_access_token = res.body.auth0.access_token
    expect(res.statusCode).toBe(200)
  });

  it('update company industries', async() => {
    requestBody = {
      industryArr:companyIndustries,
      accountType:"startup"
    }
    res = await supertest(app)
                          .post(`/api/db/startup/industries/addIndustries/${company_id}`)
                          .auth(company_access_token, { type: 'bearer' })
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });
  
  it('get admin token', async() => {
    let requestBody = {
      emailAddress:process.env.AUTH0_ADMIN_USERNAME,
      password:process.env.AUTH0_ADMIN_PWD,
    }
    let res = await supertest(app)
                          .post("/admin")
                          .send(requestBody)
    admin_access_token = res.body.access_token
    expect(res.statusCode).toBe(200)
  });
  
  it('verify startup with admin', async() => {
    requestBody = {
      "email": emailAddress,
      "removePerms": "startupUnverified",
      "addPerms": "startupVerified"
    }
    res = await supertest(app)
                          .post(`/admin/auth0/kyc/verified`)
                          .auth(admin_access_token, { type: 'bearer' })
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });
})



// this is an eg. of one test suite. 
describe('Testing Recommender System', () => {
  let thisDb = db
    
  beforeAll(async () => {
    for (let attemptCount in [...Array(10).keys()]){
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
  let startupCount = 112  // include dummy startup
  let admin_access_token

  it('load all startups', async() => {
    requestBody = {"skip_upload_photos": true}  // for faster loading
    let res = await supertest(app)
                          .post("/api/db/misc/loadStartups")
                          .send(requestBody)
  }, 10000);

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

  it('get admin token', async() => {
    let requestBody = {
      emailAddress:process.env.AUTH0_ADMIN_USERNAME,
      password:process.env.AUTH0_ADMIN_PWD,
    }
    let res = await supertest(app)
                          .post("/admin")
                          .send(requestBody)
    admin_access_token = res.body.access_token
    expect(res.statusCode).toBe(200)
  });

  it('verify retailInvestor with admin', async() => {
    requestBody = {
      "email": emailAddress,
      "removePerms": "retailInvestorUnverified",
      "addPerms": "retailInvestorVerified"
    }
    res = await supertest(app)
                          .post(`/admin/auth0/kyc/verified`)
                          .auth(admin_access_token, { type: 'bearer' })
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('login retailInvestor', async() => {
    let requestBody = {
      emailAddress:emailAddress,
      password:userPassword
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors/login")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    retailInvestor_access_token = res.body.auth0.access_token
  })

  // it('get all companies', async() => {
  //   requestBody = {}
  //   let res = await supertest(app)
  //                         .get("/api/db/startup")
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  //   startupCount = res.body.length
  // });

  it('get recommendations', async() => {
    requestBody = {
      fullInfo:null
    }
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/recommender/${retailInvestor_id}`)
                          .auth(retailInvestor_access_token, { type: 'bearer' })
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(startupCount)
    console.log(res.body.slice(0, 1))
    for (let idx in res.body.slice(0, 4)){
      console.log(res.body[idx].industries)
    }
  });

  it('get recommendations full info', async() => {
    requestBody = {
      fullInfo:true
    }
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/recommender/${retailInvestor_id}`)
                          .auth(retailInvestor_access_token, { type: 'bearer' })
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(startupCount)
    console.log(res.body.slice(0, 1))
    for (let idx in res.body.slice(0, 4)){
      console.log(res.body[idx].industries)
    }
  });

  afterAll(async () => {
    await thisDb.sequelize.drop();
    await thisDb.sequelize.close()
  })
})
