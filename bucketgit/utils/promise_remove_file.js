const fs = require('fs'),
    Promise = require('promise');

var promisify_unlink = (path) => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err)
                reject(err);
            else
                resolve(null);
        });
    });
};

module.exports = promisify_unlink;