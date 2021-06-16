const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
const fs = require('mz/fs');
const csv = require('csvtojson');

require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');

const uploadingPictures = false  // make false to speed up these tests


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
        console.log("attempt at database sync", attemptCount)
        await thisDb.sequelize.sync({force: false});
      } catch {
        continue
      }
      break
    }
  });
  
  const retailInvestor_name = 'kenny'
  const emailAddress = `${retailInvestor_name}@email.com`
  const userPassword = 'password'
  const interestedIndustries = ["Finance", "Environment"]

  const startup_csv_path = `${__dirname}/sample_files/startups.csv`

  const invalid_id = 1000000007

  let retailInvestor_id
  let startupCount = 0

  it('create companies and update industries', async() => {
    const startups = await csv().fromFile(startup_csv_path);
    for (let [cnt, data] of Object.entries(startups)){
      if (!data.name || !data.url || !data.description || !data.avatar) {continue}
      let requestBody = {
        companyName:data.name,
        emailAddress:data.url,
        companyPassword:cnt,  // mock
        profileDescription:data.description,
      }
      let res = await supertest(app)
                            .post("/api/db/startup")
                            .send(requestBody)
      expect(res.statusCode).toBe(200)
      company_id = res.body.id

      let industriesArr = data.surveyed_industries.split(",")
      if (industriesArr[0] != "") {
        requestBody = {
          industryNames:industriesArr,
          id:company_id,
          accountType:"startup"
        }
        res = await supertest(app)
                              .post(`/api/db/startup/industries/addIndustries/`)
                              .send(requestBody)
        expect(res.statusCode).toBe(200)
      }

      if (!uploadingPictures) {continue} 
      let filepath = `${__dirname}/sample_files/avatars/${data.avatar}`
      res = await supertest(app)
                        .put(`/api/db/startup/profilePhoto/${company_id}`)
                        .attach('file', filepath)
      expect(res.statusCode).toBe(200)
    };
  }, 50000)  // increased timeout

  it('get all companies', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    startupCount = res.body.length
  });

  // initialise retailInvestor
  it('create retailInvestor', async() => {
    let requestBody = {
      firstName:retailInvestor_name,
      emailAddress:emailAddress,
      userPassword:userPassword
    }
    let res = await supertest(app)
                          .post("/api/db/retailInvestors")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    retailInvestor_id = res.body.id    
  });

  // assign interested industries to retailInvestor
  it('update interested industries', async() => {
    requestBody = {
      "industryNames":interestedIndustries,
      "id":retailInvestor_id,
      "accountType":"retailInvestor"
    }
    res = await supertest(app)
                          .post(`/api/db/retailInvestors/industries/addIndustries/`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('get recommendations but invalid id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/recommender/${invalid_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('get recommendations', async() => {
    requestBody = {
      fullInfo:null
    }
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/recommender/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(startupCount)
  });

  afterAll(async () => {
    await thisDb.sequelize.close()
  })

  it('get recommendations full info', async() => {
    requestBody = {
      fullInfo:true
    }
    res = await supertest(app)
                          .get(`/api/db/retailInvestors/recommender/${retailInvestor_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    expect(res.body.length).toBe(startupCount)
  });

  afterAll(async () => {
    await thisDb.sequelize.close()
  })
})
