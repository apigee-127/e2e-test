'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var chai = require('chai');
var mkdirp = require('mkdirp');
var request = require('request');
var running = require('is-running');
var expect = chai.expect;
chai.use(require('chai-json-schema'));

var TIMEOUT = process.env.TIMEOUT || 3000;

describe('project', function() {
  var rand = Math.random().toString(36).substr(2);
  var cwd = path.join(__dirname, 'tmp', rand);
  var editServerUrl = null;
  var serverProccess;
  var editProccess;

  console.log('testing in', cwd);
  this.timeout(2 * TIMEOUT);

  function startEdit() {
    it('starts the edit server with `a127 project edit` command', function(done) {
      editProccess = spawn('a127', ['project', 'edit', '--silent'], {cwd: cwd, detached: true});

      var output = '';
      editProccess.stdout.on('data', function(data) {
        output += data;
        var lines = output.split('\n');
        if (lines.length > 2) {
          expect(output).to.contain('Running edit API server');
          editServerUrl = lines[1].substr(lines[1].indexOf('calls to ') + 9);
          done();
        }
      });
    });
  }

  function startServer() {
    it('starts the server with `a127 project start` command', function(done) {
      serverProccess = spawn('a127', ['project', 'start'], {cwd: cwd, detached: true});

      var output = '';
      serverProccess.stdout.on('data', function(data) { output += data; });

      setTimeout(function() {
        expect(output).to.contain('project started');
        done();
      }, TIMEOUT);
    });
  }

  function restartServer() {
    it('restarts the server', function(done) {
      serverProccess.stdin.write('re');
      setTimeout(done, TIMEOUT);
    });
  }

  function killServer() {
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
  }

  function killEditServer() {
    it('kills the edit server process', function(done) {
      running(editProccess.pid, function(error, live) {
        if (live) {
          process.kill(-editProccess.pid, 'SIGTERM');
        }
        expect(editProccess.connected).to.be.false;
        editProccess = null;
        done();
      });
    });
  }

  function updateYAML(yamlFileName, done) {
    var filePath = path.join(__dirname, '..', 'yaml', yamlFileName + '.yaml');
    var swaggerYamlPath = path.join(__dirname, 'tmp', rand, 'hello-world', 'api',
      'swagger', 'swagger.yaml');
    var yamlFile = fs.readFileSync(filePath).toString();

    request({
      method: 'PUT',
      url: editServerUrl,
      body: yamlFile
    }, function(error) {
      expect(error).to.be.falsy;

      // read the file from fs and make sure it's the yamlFile then done
      fs.readFile(swaggerYamlPath, function(err, file) {
        expect(err).to.be.falsy;
        expect(file.toString()).to.equal(yamlFile);
        done();
      });
    });
  }

  function updateController(controllerFileName, done) {
    var projectControllerPath = path.join(__dirname, 'tmp', rand, 'hello-world',
      'api', 'controllers', 'hello_world.js');
    var controllerPath  = path.join(__dirname, '..', 'controller', controllerFileName + '.js');
    var controller = fs.readFileSync(controllerPath);

    fs.writeFile(projectControllerPath, controller, function(err) {
      expect(err).to.be.falsy;
      done();
    });
  }

  describe('create', function() {
    it('makes a folder for a127 project', function(done) {

      mkdirp(cwd, function(error) {
        expect(error).to.be.falsy;
        expect(fs.existsSync(cwd)).to.be.true;
        done();
      });
    });

    it('makes hello-world app by executing `a127 project create hello-world`', function(done) {
      this.timeout(20 * TIMEOUT);

      var create = exec('a127 project create hello-world', {cwd: cwd}, function(error, stdout, stderr) {
        expect(error).to.be.falsy;
        expect(stderr).to.be.falsy;
        expect(stdout).to.contain('Project hello-world created');
      });

      create.on('close', function(code, signal) {
        expect(code).to.equal(0);
        expect(signal).to.be.null;
        done();
      });
    });

    it('cd into hello-world directory', function() {
      cwd = path.join(cwd, 'hello-world');

      expect(fs.existsSync(cwd)).to.be.true;
      expect(fs.lstatSync(cwd).isDirectory()).to.be.true;
    });
  });

  describe('start', function() {
    startServer();

    it('responds to a simple API request', function(done) {
      request('http://localhost:10010/hello?name=Scott', function(error, response, body) {

          expect(error).to.be.falsy;
          expect(body).to.contain('Hello, Scott');
          done();
        });
    });

    killServer();
  });

  describe('edit', function() {
    startServer();
    startEdit();

    it('updates the /hello path to /my-path in YAML file', function(done) {
      updateYAML('1', done);
    });

    it('updates controller to rename hello controller function to myPath', function(done) {
      updateController('1', done);
    });

    restartServer();

    it('makes call to /my-path to make sure /my-path responds', function(done) {
      request('http://localhost:10010/my-path?name=Scott', function(error, response, body) {

        expect(error).to.be.falsy;
        expect(body).to.contain('Hello, Scott');
        done();
      });
    });

    it('adds "last" parameter to YAML file', function(done) {
      updateYAML('2', done);
    });

    it('update the controller to include "last" in response', function(done) {
      updateController('2', done);
    });

    restartServer();

    it('makes call to /my-path?name=Mohsen&last=Azimi to make sure "last" parameter is working ', function(done) {
      request('http://localhost:10010/my-path?name=Mohsen&last=Azimi', function(error, response, body) {

        expect(error).to.be.falsy;
        expect(body).to.contain('Hello, Mohsen Azimi');
        done();
      });
    });

    it('Adds `/person/{personId}` path and get operation for it to YAML', function(done) {
      updateYAML('3', done);
    });

    it('updates the controller to include `getPerson` operation function', function(done) {
      updateController('3', done);
    });

    restartServer();

    it('should respond with a Person object when GET request made to `/person/1`', function(done) {
      var PersonSchema = {
        type: 'object',
        properties: {
          'name': {type: 'string'},
          'id': {type: 'integer'}
        }
      };

      request('http://localhost:10010/person/1', function(error, response, body) {

        expect(error).to.be.falsy;

        expect(JSON.parse(body)).to.be.jsonSchema(PersonSchema);
        done();
      });
    });

    killServer();
    killEditServer();
  });
});
