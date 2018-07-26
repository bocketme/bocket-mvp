const { NodeModel, PartModel, AssemblyModel } = require('../../../models');
const { NODE_TYPE, CHEMIN, FILE_SUPPORTED } = require('../../../constants');
const path = require('path');
const { InternalServerError, NotFound } = require('http-errors');
const log = require('../../../utils/log');

const { readdir } = require('fs');
const { promisify } = require('util');

const promiseReaddir = promisify(readdir);
const { APP, CONTENT } = CHEMIN;
const { convert } = require('../utils');

function file3DFinder(files) {
  function some(file) {
    return FILE_SUPPORTED.EXTENSION_3D.includes(path.extname(file))
  }

  return files.find(some);
}

module.exports = async function launchConverstion(req, res, next) {
  try {
    const { userId } = req.session;
    const { nodeId } = req.params;

    const node = NodeModel.findById(nodeId);

    if (!node)
      return next(NotFound('[Node] - Ressource Not Found'));

    let content;
    
    if (node.type === NODE_TYPE.PART)
      content = await PartModel.findById(node.content);
    else
      content = await AssemblyModel.findById(node.content);

    const chemin = path.join(APP.FILES3D, content.path, CONTENT["3D"]);

    const file3D = file3DFinder(await promiseReaddir(chemin));

    convert(path.join(chemin, file3D));
    return res.json({ name: node.name, _id: node._id, user: userId });
  } catch (error) {
    log.error(error);
    return next(InternalServerError());
  }
}
