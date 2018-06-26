const { NodeModel, PartModel, AssemblyModel } = require('../../../models');
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
      { file3D } = req.files;
    const node = await NodeModel.findById(nodeId);

    if (!node)
      return next(NotFound('[NODE] - Not Found'));

    const { type, content } = node;

    let { path } = type === NODE_TYPE.PART ?
      await PartModel.findById(content) :
      await AssemblyModel.findById(content);

    if (!path)
      return next(NotFound('[NODE CONTENT] - Not Found'));

    const chemin = path.join(APP.DATA, part.path, CONTENT["3D"]);

    await promiseWriteFile(path.join(chemin, file3D.originalname), file3D.buffer.toString());
  } catch (err) {
    log.error(err);
    return next(InternalServerError('Cannot operate this request'))
  }
}
