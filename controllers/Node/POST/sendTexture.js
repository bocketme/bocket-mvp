const { NodeModel, PartModel } = require('../../../models');
const { NODE_TYPE, CHEMIN } = require('../../../constants');
const path = require('path');
const { InternalServerError, NotFound, Forbidden } = require('http-errors');
const log = require('../../../utils/log');

const { writeFile } = require('fs');
const { promisify } = require('util');

const promiseWriteFile = promisify(writeFile);
const { APP, CONTENT } = CHEMIN;

module.exports = async function (req, res, next) {
  try {
    const { nodeId } = req.params,
      { textureFiles } = req.files;
    const node = await NodeModel.findById(nodeId);

    if (!node)
      return next(NotFound('[NODE] - Not Found'));

    const { type, content } = node;

    if (type !== NODE_TYPE)
      return next(Forbidden('[NODE] - Incorrect Type'));

    const part = await PartModel.findById(content);

    if (!part)
      return next(NotFound('[PART] - Not Found'));

    const chemin = path.join(APP.DATA, part.path, CONTENT["3D"]);

    await promiseWriteFile(path.join(chemin, textureFiles.originalname), textureFiles.buffer.toString());
  } catch (err) {
    log.error(err);
    return next(InternalServerError('Cannot operate this request'))
  }
}
