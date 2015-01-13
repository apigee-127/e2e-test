'use strict';

var exec = require('child_process').exec;
var chai = require('chai');
var request = require('request');
var expect = chai.expect;
var cwd = require('./2.project').getCWD();
var config = require('../config');

describe('deployment', function() {

  testDeployment(false);
  testDeployment(true);

  function testDeployment(uploadFlag) {
    var command = '127 project deploy' + (uploadFlag ? ' --upload' : '');

    it('deploys the API to Apigee by executing `' + command + '`', function(done) {
      exec(command, {cwd: cwd}, function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.not.include('Error');
        done();
      });
    });

    it('waits 2 seconds', function(done) {
      this.timeout(3 * 1000);
      setTimeout(done, 2 * 1000);
    });

    it('makes a call to deployed API to make sure deployed API is working', function(done) {
      var url = 'http://' + config.USER_ORG + '-' + config.ENVIRONMENT +
        'apigee.net/hello-world/my-path?name=Bart&last=Simpson';
      request(url, function(error, resp, body) {
        expect(error).to.be.falsy;
        expect(body).to.contain('Hello, Bart Simpson');
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
  }
});
