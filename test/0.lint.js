'use strict';

var TIMEOUT = require('../config').TIMEOUT;

describe('lint', function() {
  this.timeout(TIMEOUT);
  require('mocha-jshint')();
  require('mocha-jscs')();
});
