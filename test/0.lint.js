'use strict';

var TIMEOUT = require('../config').TIMEOUT;

describe('lint', function() {
  this.timeout(TIMEOUT * 2);
  require('mocha-jshint')();
  require('mocha-jscs')();
});
