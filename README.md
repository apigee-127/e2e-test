# [a127](http://a127.io/) end-to-end test suite

## Running the test

To run the test execute the following command:
```shell
npm install
npm test
```

### Options

Following options are available to set as environment variables:

* `TIMEOUT`: Time in milliseconds for each test operation timeout
* `SKIP_INSTALL`: If present, installation test will be skipped
* `VERSION`: specific version of `apigee-127` npm module to install. Defaults to latest release version.
* `PASSWORD`: Password of Apigee account to test against
* `USER_EMAIL`: Apigee login email
* `USER_ORG`: Apigee Organization
* `ENVIRONMENT`: Apigee Edge environment
* `APIGEE_BASE`: Apigee Edge API Base URL. Defaults to https://api.enterprise.apigee.com

#### `CONFIG` environment variable
If `CONFIG` environment variable is set to a JSON file, all options will be read from that file.

For example:

```bash
CONFIG=./my-config.json npm test
```
