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
    const { nodeId } = req.params;
    const specFile = req.file;
    const node = await NodeModel.findById(nodeId);

    if (!node)
      return next(NotFound('[NODE] - Not Found'));

    const content = node.type === NODE_TYPE.PART ?
      await PartModel.findById(node.content) :
      await AssemblyModel.findById(node.content);

    if (!content.path)
      return next(NotFound('[NODE CONTENT] - Not Found'));

    const chemin = path.join(APP.FILES3D, content.path, CONTENT["SPEC"]);

    await promiseWriteFile(path.join(chemin, specFile.originalname), specFile.buffer.toString());
    res.status(200).send('ok');
  } catch (err) {
    log.error(err);
    return next(InternalServerError('Cannot operate this request'))
  }
}
