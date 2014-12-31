var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var expect = require('chai').expect;
var mkdirp = require('mkdirp');
var request = require('request');

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

    it('makes hello-world app by executing `a127 project create hello-world`', function (done) {
        this.timeout(60 * 1000);

        var create = spawn('a127',['project', 'create', 'hello-world'], {cwd: cwd}, function (error, stdout, stderr) {
            expect(error).to.be.falsy;
            expect(stderr).to.be.falsy;
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

  describe('start', function() {
    var serverProccess;

    it('uses `a127 project start` to start the project', function (done) {
      var output = '';

      serverProccess = spawn('a127', ['project', 'start'], {cwd: cwd});

      // wait 1 second for server to start then go to next test
      setTimeout(done, 1000);
    });

    it('responds to simple API request', function (done) {
      request('http://127.0.0.1:10010/hello?name=Scott', function (error, response, body) {

          expect(error).to.be.falsy;
          expect(body).to.contain('Hello, Scott');
          done();
        });
    });

    it('kills the server process', function () {
      process.kill(serverProccess);
      expect(serverProccess.connected).to.be.false;
    });
  });
});