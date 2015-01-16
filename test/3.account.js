'use strict';

var exec = require('child_process').exec;
var chai = require('chai');
var expect = chai.expect;
var config = require('../config');

var PASSWORD = process.env.PASSWORD;

/*
 * Export delete account to be used after using the account.
*/
module.exports.deleteAccount = function() {
  describe('delete account', function() {
    it('should delete the created account with `a127 account delete` command', function(done) {
      exec('a127 account delete ' + config.USER_EMAIL, function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.contain('[]');
        done();
      });
    });
  });
};

/*
 * Export delete service to be used after using the account.
*/
module.exports.deleteService = function() {
  describe('delete service', function() {

    it('should delete TestRemoteProxy', function(done) {

      this.timeout(15 * config.TIMEOUT); // large timeout for over the net action

      exec('a127 service delete TestRemoteProxy', function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.contain('done');
        expect(stdout).not.to.contain('Error');
        done();
      });
    });
  });
};

describe('account', function() {

  this.timeout(2 * config.TIMEOUT);

  describe('create', function() {

    it('Makes an account with `a127 account create` command', function(done) {

      this.timeout(5 * config.TIMEOUT); // Large timeout for network calls

      var args = [config.USER_EMAIL,
        '-p', 'apigee',
        '-b', 'https://api.enterprise.apigee.com',
        '-o', config.USER_ORG,
        '-u', config.USER_EMAIL,
        '-w', PASSWORD,
        '-e', 'test',
        '-v', 'default',
        '--noservice'
      ].join(' ');

      exec('a127 account create ' + args, function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).not.to.contain('Error');
        expect(stdout).to.contain(config.USER_EMAIL);
        expect(stdout).to.contain(config.USER_ORG);
        done();
      });
    });

    it('creates an Apigee service', function(done) {

      this.timeout(30 * config.TIMEOUT); // large timeout for over the net action

      exec('a127 service create --type RemoteProxy TestRemoteProxy', function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.contain('Service');
        expect(stdout).to.contain('metadata:');
        expect(stdout).to.contain(config.USER_EMAIL);
        done();
      });
    });
  });

  describe('list', function() {
    it('executes `a127 account ls` to make sure account was added', function(done) {
      exec('a127 account ls', function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.contain(config.USER_EMAIL);
        done();
      });
    });
  });
});
