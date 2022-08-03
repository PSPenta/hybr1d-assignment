const chai = require('chai');
const chaiHttp = require('chai-http');
const { StatusCodes } = require('http-status-codes');
const { describe, it } = require('mocha');

const server = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

// Test Suite
describe('Testing Server Health ', () => {
  // Test Case
  it('/GET Server Health', (done) => {
    // status route is provided by the express-status-monitor
    chai.request(server).get('/status').end((err, res) => {
      if (err) {
        console.error('err', err);
        done();
      }
      expect(res.statusCode).to.equal(StatusCodes.OK);
      done();
    });
  });
});
