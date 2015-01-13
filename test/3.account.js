'use strict';

var exec = require('child_process').exec;
var chai = require('chai');
var expect = chai.expect;
var config = require('../config');

var PASSWORD = process.env.PASSWORD;

describe('account', function() {

  this.timeout(2 * config.TIMEOUT);

  describe('create', function() {

    it('Makes an account with `a127 account create` command', function(done) {

      this.timeout(5 * config.TIMEOUT); // Large timeout for network calls

      exec('a127 account create ' + [config.USER_EMAIL,
        '-p', 'apigee',
        '-b', 'https://api.enterprise.apigee.com',
        '-o', config.USER_ORG,
        '-u', config.USER_EMAIL,
        '-w', PASSWORD,
        '-e', 'test',
        '-v', 'default'
      ].join(' '), function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.contain('Apigee Remote Proxy verified');
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

/*
 * Export delete account to be used after using the account.
*/
module.exports.delete = function() {
  describe('delete account', function() {
    it('should delete the created account with `a127 account delete` command', function(done) {
      exec('a127 account delete ' + config.USER_EMAIL, function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.contain('done');
        done();
      });
    });
  });
};
