'use strict';

var _ = require('underscore');
var fs = require('fs');

var configDefaults = {

  // Time in milliseconds for each test operation timeout
  TIMEOUT: process.env.TIMEOUT || 3000,

  // If present, installation test will be skipped
  SKIP_INSTALL: process.env.SKIP_INSTALL || false,

  // specific version of `apigee-127` npm module to install. Defaults to latest release version.
  VERSION: process.env.VERSION || '',

  // Password of Apigee account to test against
  PASSWORD: process.env.PASSWORD,

  // Apigee Organization name
  USER_ORG: process.env.USER_ORG,

  // Apigee login email
  USER_EMAIL: process.env.USER_EMAIL,

  // Apigee Edge environment
  ENVIRONMENT: process.env.ENVIRONMENT,

  // Apigee Edge Base URL.
  APIGEE_BASE: process.env.APIGEE_BASE || 'https://api.enterprise.apigee.com'
};

var configFile = {};

try {
  configFile = JSON.parse(fs.readFileSync(process.env.CONFIG).toString());
} catch (e) {
  console.error(e);
}

module.exports = _.defaults(configFile, configDefaults);
