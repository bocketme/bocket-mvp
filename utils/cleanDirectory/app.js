const moduleName = 'clean-directory';
const fs = require('fs');
const { resolve, join } = require('path');

const util = require('util');

const unlink = util.promisify(fs.unlink);
const readdir = util.promisify(fs.readdir);
const rmDir = util.promisify(fs.rmdir);
const stat = util.promisify(fs.stat);

async function cleanDirectory(path, options) {
  const pathResolved = resolve(path);
  const { filterCallback: filter } = options;
  const files = await readdir(path);
  const deletedFiles = [];
  const results = [];

  for (let i = 0; i < files.length; i += 1) {
    if ((!filter) || (filter && filter(files[i]))) {
      deletedFiles.push(files[i]);
      const filepath = join(resolve(pathResolved), files[i]);
      const stats = await stat(filepath);
      if (stats.isDirectory()) {
        results.push(rmDir(filepath));
      } else {
        results.push(unlink(filepath));
      }
    }
  }
  await Promise.all(results);
  return deletedFiles;
}

module.exports = function (path, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = { };
  }
  if (!path) { throw Error(`${moduleName} error: a path must be given`); }
  if (typeof path !== 'string') { throw Error(`${moduleName} error: the first param must be a string`); }
  if (typeof options !== 'object') { throw Error(`${moduleName} error: second param must be an object`); }
  if (callback && typeof callback !== typeof cleanDirectory) { throw Error(`${moduleName} error: third param must be a callback`); }

  if (callback) {
    cleanDirectory(path, options)
      .then(files => callback(null, files))
      .catch(callback);
    return;
  }
  return cleanDirectory(path, options);
};
