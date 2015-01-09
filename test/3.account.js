'use strict';

var exec = require('child_process').exec;
var chai = require('chai');
var expect = chai.expect;

var TIMEOUT = process.env.TIMEOUT || 3000;
var USER_EMAIL = process.env.USER_EMAIL || 'mazimi+a127-e2e@apigee.com';
var USER_NAME = process.env.USER_NAME || 'mazimi_a127';
var PASSWORD = process.env.PASSWORD;

describe('account', function() {

  this.timeout(2 * TIMEOUT);

  describe('create', function() {

    it('Makes an account with `a127 account create` command', function(done) {

      this.timeout(5 * TIMEOUT); // Large timeout for network calls

      exec('a127 account create ' + [USER_EMAIL,
        '-p', 'apigee',
        '-b', 'https://api.enterprise.apigee.com',
        '-o', USER_NAME,
        '-u', USER_EMAIL,
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
        expect(stdout).to.contain(USER_EMAIL);
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
      exec('a127 account delete ' + USER_EMAIL, function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.contain('done');
        done();
      });
    });
  });
};
