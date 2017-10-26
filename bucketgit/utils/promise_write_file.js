const fs = require('fs'),
    Promise = require('promise');

/**
 * Write a file with promise
 *
 * @param {String} path - File's Path
 * @param {String} data - File's data
 * @returns {Promise}
 */
var promisify_writeFile = (path, data) => {
    return new Promise((fufill, reject) => {
        fs.writeFile(path, data, err => {
            if (err)
                reject(err);
            else
                fufill(null);
        });
    });
};

module.exports = promisify_writeFile;