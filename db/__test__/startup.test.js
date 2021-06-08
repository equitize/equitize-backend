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

  const companyName = 'equitize'
  const emailAddress = `company-${companyName}@email.com`
  const companyPassword = 'password'

  const companyName_alt = 'tesla_motors'
  const emailAddress_alt = `company-${companyName_alt}@email.com`
  const companyPassword_alt = 'password'

  const companyName_new = 'tesla_motors2'

  const commercialChampion_name = "CC Lee"
  const commercialChampion_email = "lee@champion.com"

  const milestone_title = "Sample milestone title"
  const milestonePart = 1
  const milestone_endDate = "Sample milestone endDate"
  const milestone_amount = 100

  const invalid_string = 'sample_invalid_string'
  const invalid_id = 1000000007

  let company_id

  it('create company', async() => {
    let requestBody = {
      companyName:companyName,
      emailAddress:emailAddress,
      companyPassword:companyPassword
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    company_id = res.body.id    
  });

  it('create company but missing info', async() => {
    let requestBody = {
      companyName:companyName_alt,
      emailAddress:emailAddress_alt,
      // companyPassword:companyPassword_alt  // info missed
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(400)
  });

  it('create company but duplicate info', async() => {
    let requestBody ={
      companyName:companyName,  // duplicate info
      emailAddress:emailAddress,  // duplicate info
      companyPassword:companyPassword
    }
    let res = await supertest(app)
                          .post("/api/db/startup")
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('create startup with different info', async() => {
    let requestBody = {
      companyName:companyName_alt,
      emailAddress:emailAddress_alt,
      companyPassword:companyPassword_alt
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
                          .get(`/api/db/startup/${invalid_id}`)
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
                          .get(`/api/db/startup/companyName/${companyName}`)
                          .send(requestBody)
    expect(res.body.length).toBe(1)
    expect(res.statusCode).toBe(200)
  });

  it('get by company name but invalid', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/companyName/${invalid_string}`)
                          .send(requestBody)
    // expect(res.statusCode).toBe(500)
  });

  it('get by company email', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/email/${emailAddress}`)
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
      companyName:companyName_new,
    }
    res = await supertest(app)
                          .put(`/api/db/startup/${company_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('update company details but company name is duplicate', async() => {
    requestBody = {
      companyName:companyName_alt,
    }
    res = await supertest(app)
                          .put(`/api/db/startup/${company_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('create campaign', async() => {
    requestBody = {
      companyId:company_id,
    }
    res = await supertest(app)
                          .post(`/api/db/startup/setCampaign`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
    campaign_id = res.body.id    
  });

  // it('update campaign', async() => {  // IDK how to use this
  //   requestBody = {
  //     id:campaign_id,
  //   }
  //   res = await supertest(app)
  //                         .post(`/api/db/startup/campaign/update/${company_id}`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  // });

  it('set commerical champion', async() => {
    requestBody = {
      companyId:company_id,
      name:commercialChampion_name,
      email:commercialChampion_email
    }
    res = await supertest(app)
                          .post(`/api/db/startup/setCommercialChampion`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });  
  
  it('set milestone', async() => {
    requestBody = {
      companyId:company_id,
      title:milestone_title,
      milestonePart:milestonePart,
      endDate:milestone_endDate,
      amount:milestone_amount
    }
    res = await supertest(app)
                          .post(`/api/db/startup/setMilestone`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  }); 

  it('get campaign', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/getCampaign/${company_id}`)
                          .send(requestBody)
    console.log(res.body)
    expect(res.body.length).toBe(1)
    expect(res.statusCode).toBe(200)
  });

  it('get commercial champion', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/getCommercialChampion/${company_id}`)
                          .send(requestBody)
    expect(res.body.length).toBe(1)
    expect(res.statusCode).toBe(200)
  });

  it('get milestone', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/getMilestone/${company_id}`)
                          .send(requestBody)
    expect(res.body.length).toBe(1)
    expect(res.statusCode).toBe(200)
  });

  it('update company details but invalid id', async() => {
    requestBody = {
      companyName:companyName,
    }
    res = await supertest(app)
                          .put(`/api/db/startup/${invalid_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(500)
  });

  it('delete company by id but invalid id', async() => {
    requestBody = {}
    res = await supertest(app)
                          .delete(`/api/db/startup/${invalid_id}`)
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
                          .delete(`/api/db/startup/${company_id}`)
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
