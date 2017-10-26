const fs = require('fs'),
    Promise = require('promise');


var promisify_rmdir = (path) => {
    return new Promise((resolve, reject) => {
        fs.rmdir(path, (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    });
};

module.exports = promisify_rmdir;