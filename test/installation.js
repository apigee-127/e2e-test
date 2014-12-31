var exec = require('child_process').exec;
var expect = require('chai').expect;

describe('installation', function() {
  this.timeout(50000);

  it('should install a127 executable globally', function(done) {
    exec('npm install -g apigee-127', function(error, stdout, stderr){
      expect(error).to.be.falsy;
      done();
    });
  });

  it('should print help when executing `a127`', function(done) {
    exec('a127', function(error, stdout, stderr) {
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