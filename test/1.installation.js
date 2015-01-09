'use strict';

var exec = require('child_process').exec;
var expect = require('chai').expect;
var describeMethod = process.env.SKIP_INSTALL ? xdescribe : describe;
var version = process.env.VERSION ? '@' + process.env.VERSION : '';

describeMethod('installation', function() {
  this.timeout(50000);

  it('should install a127 executable globally with npm install -g apigee-127' + version + ' command', function(done) {
    exec('npm install -g apigee-127' + version, function(error) {
      expect(error).to.be.falsy;
      done();
    });
  });

  it('should print help when executing `a127`', function(done) {
    exec('a127', function(error, stdout) {
      expect(stdout).to.contain('Usage: a127 [options] [command]');
      expect(stdout).to.contain('account <action>');
      expect(stdout).to.contain('project <action>');
      expect(stdout).to.contain('usergrid <action>');
      expect(stdout).to.contain('config');
      expect(stdout).to.contain('wiki');
      expect(stdout).to.contain('help [cmd]');
      done();
    });
  });
});