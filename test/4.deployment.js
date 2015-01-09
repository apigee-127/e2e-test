'use strict';

var exec = require('child_process').exec;
var chai = require('chai');
var expect = chai.expect;
var deleteAccount = require('./3.account').delete;
var cwd = require('./2.project').getCWD();

describe('deployment', function() {
  it('deploys the API to Apigee by executing `a127 project deploy`', function(done) {
    exec('127 project deploy', {cwd: cwd}, function(error, stdout, stderr) {
      expect(error).to.be.falsy;
      expect(stderr).to.be.falsy;
      done();
    });
  });

  it('undeploys the API from Apigee by executing `a127 project undeploy`', function(done) {
    exec('127 project undeploy', {cwd: cwd}, function(error, stdout, stderr) {
      expect(error).to.be.falsy;
      expect(stderr).to.be.falsy;
      done();
    });
  });

  deleteAccount();
});
