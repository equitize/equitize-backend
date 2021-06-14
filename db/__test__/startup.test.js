const app = require("../../app")
const supertest = require('supertest')
const db  = require("../models/index")
const fs = require('mz/fs');

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
  const companyIndustries = ["Finance", "Environment"]

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

  const sample_mp4_path = `${__dirname}/sample_files/sample.mp4`
  const sample_pdf_path = `${__dirname}/sample_files/sample.pdf`
  const signed_url_prefix = "https://storage.googleapis.com/equitize-"

  const upload_test_permutations = [  // endpoint/description, filepath
    ["video",        sample_mp4_path],
    ["pitchDeck",    sample_pdf_path],
    ["capTable",     sample_pdf_path],
    ["bankInfo",     sample_pdf_path],
    ["acraDocuments",sample_pdf_path],
    ["idProof",      sample_pdf_path],
    ["profilePhoto", sample_pdf_path]
  ]

  let company_id
  let company_id_alt

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
    company_id_alt = res.body.id    
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

  it('update company industries', async() => {
    requestBody = {
      industryNames:companyIndustries,
      id:company_id,
      accountType:"startup"
    }
    res = await supertest(app)
                          .post(`/api/db/startup/industries/addIndustries/`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
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

  it('update campaign', async() => {
    requestBody = {
      tokensMinted:0.20,
    }
    res = await supertest(app)
                          .put(`/api/db/startup/campaign/update/${company_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('create by update campaign', async() => {
    requestBody = {
      tokensMinted:0.69,
    }
    res = await supertest(app)
                          .put(`/api/db/startup/campaign/update/${company_id_alt}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  // upload tests
  for (let [_, [endpoint, filepath]] of Object.entries(upload_test_permutations)){
    it(`upload ${endpoint}`, async() => {
      exists = await fs.exists(filepath)
      if (!exists) {
        console.log(`${filepath} not found`);
        throw new Error(`${filepath} not found`); 
      }
      res = await supertest(app)
                        .put(`/api/db/startup/${endpoint}/${company_id}`)
                        .attach('file', filepath)
      expect(res.statusCode).toBe(200)
    });
  }

  // get SignedURL tests
  for (let [_, [endpoint, filepath]] of Object.entries(upload_test_permutations)){
    it(`get uploaded ${endpoint}`, async() => {
      requestBody = {
        fileType:endpoint,
      }
      res = await supertest(app)
                        .get(`/api/db/startup/${endpoint}/${company_id}`)
                        .send(requestBody)
      expect(res.body.message).toMatch(new RegExp(`^${signed_url_prefix}?`));
      expect(res.statusCode).toBe(200)
    });
  }

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
  
  // milestone is tied to company, not campaign it seems
  it('set milestone part 1', async() => {
    requestBody = {
      part:milestonePart,   // could be duplicate, it seems
      startupId:company_id,
      endDate:milestone_endDate,
      description:milestone_title,
      amount:milestone_amount,  // any checks on this?
    }
    res = await supertest(app)
                          .post(`/api/db/startup/milestone/addPart`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  }); 

  it('set milestone part 2', async() => {
    requestBody = {
      part:milestonePart+1,   // could be duplicate, it seems
      startupId:company_id,
      endDate:milestone_endDate,
      description:milestone_title+" part 2",
      amount:milestone_amount,  // any checks on this?
    }
    res = await supertest(app)
                          .post(`/api/db/startup/milestone/addPart`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('get campaign', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/getCampaign/${company_id}`)
                          .send(requestBody)
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

  it('get milestones', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/milestone/getMilestone/${company_id}`)
                          .send(requestBody)
    expect(res.body.length).toBe(2)
    expect(res.statusCode).toBe(200)
  });

  it('delete milestone part', async() => {
    requestBody = {
      part:milestonePart
    }
    res = await supertest(app)
                          .delete(`/api/db/startup/milestone/deletePart/${company_id}`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  it('count remaining milestones', async() => {
    requestBody = {}
    res = await supertest(app)
                          .get(`/api/db/startup/milestone/getMilestone/${company_id}`)
                          .send(requestBody)
    expect(res.body.length).toBe(1)
    expect(res.statusCode).toBe(200)
  });

  it('delete milestone all', async() => {
    requestBody = {
      startupId:company_id
    }
    res = await supertest(app)
                          .delete(`/api/db/startup/milestone/deleteMilestone/`)
                          .send(requestBody)
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
