var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var expect = require('chai').expect;
var mkdirp = require('mkdirp');

describe('project', function() {
  var rand = Math.random().toString(36).substr(2);
  var cwd = path.join(__dirname, 'tmp', rand);

  console.log('testing in', cwd);
  this.timeout(5000);

  describe('create', function() {
    it('makes a folder for a127 project', function (done) {
      mkdirp(cwd, function (error){
        expect(error).to.be.falsy;
        expect(fs.existsSync(cwd)).to.be.true;
        done();
      });
    });

    it('makes hello-world app by executing `a127 project create hello-world`',
      function (done) {
        this.timeout(60 * 1000);
        var create = exec('a127 project create hello-world', {cwd: cwd},
          function (error, stdout, stderr) {
            expect(error).to.be.falsy;
            expect(stdout).to.contain('Project hello-world created');
        });

        create.on('exit', function (code, signal) {
          expect(code).to.equal(0);
          expect(signal).to.be.null;
          done();
        });
    });

    it('cd into hello-world directory', function(){
      cwd = path.join(cwd, 'hello-world');
      expect(fs.existsSync(cwd)).to.be.true;
      expect(fs.lstatSync(cwd).isDirectory()).to.be.true;
    });
  });

  xdescribe('start', function() {

  });
});