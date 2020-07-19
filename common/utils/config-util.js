const nconf = require('nconf');
const fs = require('fs');
const path = require('path');

function Config() {
    nconf.argv().env();
    const environment = "development"
    process.chdir(path.join(__dirname, '../configs/'));
    const relativePath = process.cwd();
    const sampleFile = relativePath + "/sample.json";
        //Read development.json file.
    const devFile = relativePath + "/dev.json";
    const devData = fs.readFileSync(devFile,'utf8');
        //Write config data to sample file
    fs.writeFileSync(sampleFile, devData);
    nconf.file(environment, relativePath + '/sample.json');

}

Config.prototype.get = function(key) {
    return nconf.get(key);
};

module.exports = new Config();
