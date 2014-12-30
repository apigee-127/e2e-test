var Mocha = require('mocha'),
    mocha = new Mocha(),
    fs = require('fs'),
    path = require('path'),
    TEST_DIR = 'test';

fs.readdirSync(TEST_DIR).filter(function(file){
    // Only keep the .js files
    return file.substr(-3) === '.js';

}).forEach(function(file){
    // Use the method "addFile" to add the file to mocha
    mocha.addFile(path.join(TEST_DIR, file));
});

// Now, you can run the tests.
mocha.run(function(failures){
  process.on('exit', function () {
    process.exit(failures);
  });
});