var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var expect = require('chai').expect;
var mkdirp = require('mkdirp');
var request = require('request');



describe('project', function() {
  var rand = Math.random().toString(36).substr(2);
  var cwd = path.join(__dirname, 'tmp', rand);
  var editServerUrl = null;
  var serverProccess;
  var editProccess;

  console.log('testing in', cwd);
  this.timeout(5000);


  function startEdit(){
    it('starts the edit server with `a127 project edit` command', function (done) {
      editProccess = exec('a127 project edit', {cwd: cwd}, function (error, stdout, stderr) {

        // after killing edit there should be no error
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
      });

      var output = '';
      editProccess.stdout.on('data', function (data) { output += data; });

      // wait 1 second for server to start then go to next test
      setTimeout(function () {
        expect(output).to.contain('Starting Swagger editor.');
        output.split('\n').forEach(function (line) {
          if (line.indexOf('Opening browser to:') > -1 ) {
            editServerUrl = line.substr(line.indexOf('to: ') + 4);
            editServerUrl = editServerUrl.substr(0, editServerUrl.indexOf('#')) + 'editor/spec';
          }
        });
        done();
      }, 3000);
    });
  }

  function startServer() {
    it('starts the server with `a127 project start` command', function (done) {
      serverProccess = exec('a127 project start', {cwd: cwd}, function (error, stdout, stderr) {

        // after killing server there should be no errors
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
      });

      var output = '';
      serverProccess.stdout.on('data', function (data) { output += data; });

      // wait 1 second for server to start then go to next test
      setTimeout(function () {
        expect(output).to.contain('project started');
        done();
      }, 1000);
    });
  }

  function restartServer() {
    it('restarts the server', function (done){
      serverProccess.stdin.write('re');
      setTimeout(done, 1000);
    });
  };

  function killServer() {
    it('kills the server process', function (done) {
      serverProccess.kill()
      expect(serverProccess.connected).to.be.false;
      setTimeout(done, 1000);
    });
  }

  function killEditServer() {
     it('kills the edit server process', function (done) {
      editProccess.kill();
      expect(editProccess.connected).to.be.false;
      setTimeout(done, 1000);
    });
  }

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

        var create = exec('a127 project create hello-world', {cwd: cwd}, function (error, stdout, stderr) {
            expect(error).to.be.falsy;
            expect(stderr).to.be.falsy;
            expect(stdout).to.contain('Project hello-world created');
        });

        create.on('close', function (code, signal) {
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
    startServer();

    it('responds to a simple API request', function (done) {
      request('http://127.0.0.1:10010/hello?name=Scott', function (error, response, body) {

          expect(error).to.be.falsy;
          expect(body).to.contain('Hello, Scott');
          done();
        });
    });

   killServer();

  });

  describe('edit', function () {
    startServer();
    startEdit();

    it('updates the /hello path to /my-path', function (done) {
      var filePath = path.join(__dirname, '..', 'yaml/1_updated_path.yaml');
      var yamlFile = fs.readFileSync(filePath).toString();

      request({
        method: 'PUT',
        url: editServerUrl,
        body: yamlFile
      }, function (error, response, body) {
        expect(error).to.be.falsy;
        done();
      });
    });

    restartServer();

    it('makes call to /my-path', function (done) {
      request('http://127.0.0.1:10010/my-path?name=Scott', function (error, response, body) {

        expect(error).to.be.falsy;
        expect(body).to.contain('Hello, Scott');
        done();
      });
    });

    killServer();
    killEditServer();
  });
});