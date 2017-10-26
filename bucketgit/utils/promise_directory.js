const fs = require('fs'),
    Promise = require('promise');

/**
 * Promise the creation of a directory
 *
 * @param {String} path - path where the directory will be created
 * @returns {Promise}
 */
var promisify_directory = (path) => {
    return new Promise((fufill, reject) => {
        fs.mkdir(path, err => {
            if (err)
                reject(err);
            else
                fufill(null);
        });
    });
};

module.exports = promisify_directory;