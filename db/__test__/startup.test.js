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

  const companyName = 'equitize'
  const emailAddress = `company-${companyName}@email.com`
  const companyPassword = 'password'
  const companyIndustries = [
    {"name":"Finance", "id":1},
    {"name":"Tech", "id":2},
    {"name":"Farming", "id":3}
  ]

  const companyName_alt = 'tesla_motors'
  const emailAddress_alt = `company-${companyName_alt}@email.com`
  const companyPassword_alt = 'password'

  const companyName_new = 'tesla_motors2'

  const commercialChampion_name = "CC Lee"
  const commercialChampion_email = "lee@champion.com"

  const milestone_title = "Sample milestone title"
  const milestonePart = 1
  const milestone_endDate = "Sample milestone endDate"
  const milestone_percentage_funds_1 = 30
  const milestone_percentage_funds_2 = 60

  const invalid_string = 'sample_invalid_string'
  const invalid_id = 1000000007

  const sample_mp4_path = `${__dirname}/sample_files/sample.mp4`
  const sample_pdf_path = `${__dirname}/sample_files/sample.pdf`
  const signed_url_prefix = "https://storage.googleapis.com/equitize-"

  const upload_test_permutations_special = [  // endpoint/description, filepath
    ["video",      "videoCloudID",     "videoOriginalName",     sample_mp4_path],
    ["pitchDeck",  "pitchDeckCloudID", "pitchDeckOriginalName", sample_pdf_path]
  ]

  const upload_test_permutations = [  // endpoint/description, filepath
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
      password:companyPassword,
      profileDescription:companyName
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
      // password:companyPassword_alt  // info missed
      profileDescription:companyName
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
      password:companyPassword,
      profileDescription:companyName
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
      password:companyPassword_alt,
      profileDescription:companyName
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
      industryArr:companyIndustries,
      id:company_id,
      accountType:"startup"
    }
    res = await supertest(app)
                          .post(`/api/db/startup/industries/addIndustries/`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  // silenced
  // it('update company details', async() => {
  //   requestBody = {
  //     companyName:companyName_new,
  //   }
  //   res = await supertest(app)
  //                         .put(`/api/db/startup/${company_id}`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  // });

  // it('update company details but company name is duplicate', async() => {
  //   requestBody = {
  //     companyName:companyName_alt,
  //   }
  //   res = await supertest(app)
  //                         .put(`/api/db/startup/${company_id}`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(500)
  // });

  // it('update company details but invalid id', async() => {
  //   requestBody = {
  //     companyName:companyName,
  //   }
  //   res = await supertest(app)
  //                         .put(`/api/db/startup/${invalid_id}`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(500)
  // });

  // not implemented
  // it('create campaign', async() => {
  //   requestBody = {
  //     startupId:company_id,
  //   }
  //   res = await supertest(app)
  //                         .post(`/api/db/admin/createCampaign`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  //   campaign_id = res.body.id    
  // });

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

  // upload and get tests for video and pitch decks
  for (let [_, [endpoint, bodyType, bodyName, filepath]] of Object.entries(upload_test_permutations_special)){
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

    it(`get uploaded ${endpoint}`, async() => {
      requestBody = {
        cloudIDType:bodyType,
        fileOGName:bodyName
      }
      res = await supertest(app)
                        .get(`/api/db/startup/getSignedURLPlus/${endpoint}/${company_id}`)
                        .send(requestBody)
      expect(res.body.signedURL).toMatch(new RegExp(`^${signed_url_prefix}?`));
      expect(res.statusCode).toBe(200)
    });
  }

  // upload tests for other files
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

    it(`get uploaded ${endpoint}`, async() => {
      requestBody = {
        fileType:endpoint,
      }
      res = await supertest(app)
                        .get(`/api/db/startup/getSignedURL/${endpoint}/${company_id}`)
                        .send(requestBody)
      expect(res.body.signedURL).toMatch(new RegExp(`^${signed_url_prefix}?`));
      expect(res.statusCode).toBe(200)
    });
  }

  it('set commerical champion', async() => {
    requestBody = {
      startupId:company_id,
      name:commercialChampion_name,
      email:commercialChampion_email,
      professsion:commercialChampion_name,
      fieldsOfInterest:commercialChampion_name
    }
    res = await supertest(app)
                          .post(`/api/db/startup/setCommercialChampion`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });  
  
  // milestone is tied to company, not campaign it seems
  it('set milestone part 1', async() => {
    requestBody = {
      title: "1st milestone title",
      part:milestonePart,   // could be duplicate, it seems
      startupId:company_id,
      endDate:milestone_endDate,
      description:milestone_title,
      percentageFunds:milestone_percentage_funds_1,  // any checks on this?
    }
    res = await supertest(app)
                          .post(`/api/db/startup/milestone/addPart`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  }); 

  it('set milestone part 2', async() => {
    requestBody = {
      title: "2nd milestone title",
      part:milestonePart+1,   // could be duplicate, it seems
      startupId:company_id,
      endDate:milestone_endDate,
      description:milestone_title+" part 2",
      percentageFunds:milestone_percentage_funds_2,  // any checks on this?
    }
    res = await supertest(app)
                          .post(`/api/db/startup/milestone/addPart`)
                          .send(requestBody)
    expect(res.statusCode).toBe(200)
  });

  // could not find endpoint for this
  // it('get campaign', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .get(`/api/db/startup/getCampaign/${company_id}`)
  //                         .send(requestBody)
  //   expect(res.body.length).toBe(1)
  //   expect(res.statusCode).toBe(200)
  // });

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

  // silenced
  // it('delete all companies', async() => {
  //   requestBody = {}
  //   res = await supertest(app)
  //                         .delete(`/api/db/admin/`)
  //                         .send(requestBody)
  //   expect(res.statusCode).toBe(200)
  // });

  afterAll(async () => {
    await thisDb.sequelize.drop();
    await thisDb.sequelize.close()
  })
})
