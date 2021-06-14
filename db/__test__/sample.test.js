const supertest = require('supertest')
const fs = require('mz/fs');

require('mysql2/node_modules/iconv-lite').encodingExists('cesu8');

// The only purpose of this test is to check if Github Actions can run Jest

// import supertest from "supertest"
it('Testing to see if Jest works', () => {
    expect(1).toBe(1)
})