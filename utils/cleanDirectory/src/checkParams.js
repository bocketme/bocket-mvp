const moduleName = 'clean-directory';

/*
  if (typeof path === "string") { throw Error(`${moduleName} error: the first param must be a string`); }
  if (typeof cb !== typeof cleanDirectory) { throw Error(`${moduleName} error: second param must be a callback`); }
  if (typeof cb2 !== typeof cleanDirectory) { throw Error(`${moduleName} error: third param must be a callback`); }
 */

function checkPath(path) {
  if (!path) {
    throw Error(`${moduleName} error: a path must be given`);
  }
}

function checkFirstCb(path, cb1) {

}

const errors = [
  checkPath,
];

function checkParams(path, cb1, cb2) {
  for (let i = 0; i < errors.length; i++) {
    errors[i](path, cb1, cb2);
  }
}

module.exports = checkParams;
