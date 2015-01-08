'use strict';

var TIMEOUT = process.env.TIMEOUT ? TIMEOUT * 2 : 6000;

describe('lint', function() {
  this.timeout(TIMEOUT);
  require('mocha-jshint')();
  require('mocha-jscs')();
});
