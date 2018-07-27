const nodeModel = require('../../../models/Node');
const workspaceModel = require('../../../models/Workspace');
const partModel = require('../../../models/Part');
const { NODE_TYPE, CHEMIN, FILE_SUPPORTED } = require('../../../constants');
const path = require('path');
const { InternalServerError, NotFound, Forbidden } = require('http-errors');
const log = require('../../../utils/log');

const { readdir, unlink } = require('fs');
const { promisify } = require('util');

const promiseUnlink = promisify(unlink);
const promiseReaddir = promisify(readdir);
const { APP, CONTENT } = CHEMIN;
const { convert } = require('../utils');

function file3DFinder(files) {
  function some(file) {
    const extname = path.extname(file);
    const response = FILE_SUPPORTED.EXTENSION_3D.includes(extname.substring(1))
    return response;
  }
  return files.find(some);
}

function fileJsonFinder(files) {
  function some(file) {
    return path.extname(file) === ".json";
  }
  return files.find(some);
}

module.exports = async function launchConverstion(req, res, next) {
  try {
    const { userId } = req.session;
    const { nodeId } = req.params;

    const node = await nodeModel.findById(nodeId);

    if (!node)
      return next(NotFound('[Node] - Ressource Not Found'));

    const part = await partModel.findById(node.content);

    if (!part) return next(NotFound());

    const chemin = path.join(APP.FILES3D, part.path, CONTENT["3D"]);

    const directory3D = await promiseReaddir(chemin)

    const fileJson = fileJsonFinder(directory3D)

    if (fileJson)
      await promiseUnlink(path.join(chemin, fileJson))

    convert(path.join(chemin, file3DFinder(directory3D)));
    return res.json({ name: node.name, _id: node._id, user: userId });
  } catch (error) {
    log.error(error);
    return next(InternalServerError());
  }
}
