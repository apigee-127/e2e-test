# [a127](http://a127.io/) end-to-end test suite

[![Build Status](https://circleci.com/gh/apigee-127/e2e-test.png?circle-token=addee0cd2fcc62f270cbcb8902003e243643b951)](https://circleci.com/gh/apigee-127/e2e-test)
[![Build Status](https://travis-ci.org/apigee-127/e2e-test.svg?branch=master)](https://travis-ci.org/apigee-127/e2e-test)


## Running the test

To run the test execute the following command:
```shell
npm test
```

### Options

Following options are available to set as environment variables:

* `TIMEOUT`: Time in milliseconds for each test operation timeout
* `SKIP_INSTALL`: If present, installation test will be skipped
* `VERSION`: specific version of `apigee-127` npm module to install. Defaults to latest release version.
* `PASSWORD`: Password of Apigee account to test against
* `USER_NAME`: Apigee Organization name
* `USER_EMAIL`: Apigee login email
