const converter = require("../../../converter/converter");
const partFileSystem = require("../../../config/PartFileSystem");
const { log } = require('./index');
/**
 *
 * @param {String} filePath
 * @returns {}
 */
module.exports = function (filePath) {
  return Boolean(converter.JSimport(filePath));
}
