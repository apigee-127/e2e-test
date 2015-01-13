'use strict';

var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var path = require('path');
var chai = require('chai');
var request = require('request');
var running = require('is-running');
var expect = chai.expect;
var TIMEOUT = process.env.TIMEOUT || 3000;
var deleteAccount = require('./3.account').delete;
var cwd = path.join(__dirname, '..', 'apigee-api-workshop');
var config = require('../config');

describe('workshop', function() {
  var serverProccess = null;

  this.timeout(2 * TIMEOUT);

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
    request('http://localhost:8888/hello?name=Peter', function(error, response, body) {
      expect(error).to.be.falsy;
      expect(body).to.contain('Hello, Peter');
      done();
    });
  });

  xit('makes an HTTP GET request to /restaurants path');

  it('deploys the API to Apigee by executing `a127 project deploy`', function(done) {
    exec('127 project deploy', {cwd: cwd}, function(error, stdout, stderr) {
      expect(error).to.be.falsy;
      expect(stderr).to.be.falsy;
      done();
    });
  });

  it('waits 2 seconds', function(done) {
    this.timeout(3 * 1000);
    setTimeout(done, 2 * 1000);
  });

  it('makes a call to deployed API to make sure deployed API is working', function(done) {
    var url = 'http://' + config.USER_ORG + '-' + config.ENVIRONMENT +
      '.apigee.net/apigee-api-workshop/my-path?name=Bart&last=Simpson';
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

  deleteAccount();

  it('kills the server process', function(done) {
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
