const fs = require('fs'),
    Promise = require('promise');

var pomisify_readfile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

module.exports = pomisify_readfile;