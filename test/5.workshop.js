'use strict';

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');
var chai = require('chai');
var request = require('request');
var running = require('is-running');
var expect = chai.expect;
var TIMEOUT = process.env.TIMEOUT || 3000;
var deleteAccount = require('./3.account').deleteAccount;
var deleteService = require('./3.account').deleteService;
var cwd = path.join(__dirname, '..', 'apigee-api-workshop');
var config = require('../config');
var serverProccess = null;

describe('workshop', function() {

  this.timeout(4 * TIMEOUT);

  describe('test locally', function() {

    it('start the project server', function(done) {
      serverProccess = spawn('a127', ['project', 'start'], {cwd: cwd, detached: true});

      var output = '';
      serverProccess.stdout.on('data', function(data) { output += data; });

      setTimeout(function() {
        expect(output).to.contain('project started');
        done();
      }, TIMEOUT);
    });

    it('makes an HTTP GET request to /hello path', function(done) {
      request('http://localhost:10010/hello?name=Peter', function(error, response, body) {
        expect(error).to.be.falsy;
        expect(body).to.contain('Hello, Peter');
        done();
      });
    });
  });

  describe('deployment', function() {

    console.log('Waiting ' + 60 * config.TIMEOUT + ' seconds for deployment');
    this.timeout(60 * config.TIMEOUT);

    it('deploys the API to Apigee by executing `a127 project deploy --upload`', function(done) {

      exec('a127 project deploy --upload', {cwd: cwd}, function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.not.include('Error');
        done();
      });
    });

    it('waits ' + (config.TIMEOUT * 3) / 1000 + ' seconds', function(done) {
      setTimeout(done, (config.TIMEOUT * 3));
    });

    it('makes a call to deployed API to make sure deployed API is working', function(done) {
      var url = 'http://' + config.USER_ORG + '-' + config.ENVIRONMENT +
        '.apigee.net/apigee-api-workshop-v2/hello?name=Bart&last=Simpson';
      request(url, function(error, resp, body) {
        expect(error).to.be.falsy;
        expect(body).to.contain('Hello, Bart Simpson');
        done();
      });
    });
  });

  describe('oauth', function() {
    it('gets OAuth API key', function() {
      expect('true').to.be.a.string;
    });
  });

  describe('undeployment', function() {

    it('undeploys the API from Apigee by executing `a127 project undeploy`', function(done) {
      exec('a127 project undeploy', {cwd: cwd}, function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        done();
      });
    });
  });
});

describe('cleanup', function() {

  deleteService();
  deleteAccount();

  it('kills the server process', function(done) {
    if (!serverProccess) { return done(); }
    running(serverProccess.pid, function(err, live) {
      if (live) {
        process.kill(-serverProccess.pid, 'SIGTERM');
      }
      expect(serverProccess.connected).to.be.false;
      serverProccess = null;
      done();
    });
  });
});
