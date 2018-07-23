const nodeModel = require('../../../models/Node');
const workspaceModel = require('../../../models/Workspace');
const partModel = require('../../../models/Part');
const config = require('../../../config/server');
const fs = require('fs');
const nodeTypeEnum = require('../../../enum/NodeTypeEnum');
const log = require('../../../utils/log');
const partFileSystem = require("../../../config/PartFileSystem");

const util = require('util');

const deleteFile = util.promisify(fs.unlink);

const path = require('path');

async function deleteTexture(req, res) {
  const { nodeId, file } = req.params;

  const node = await nodeModel.findById(nodeId);

  if (!node) return res.status(404).send('Not Found');

  const workspace = await workspaceModel.findById(node.Workspace);

  const { userId } = req.session;
  const rights = workspace.hasRights(userId);

  if (!rights || rights === 1)
  return res.status(403).send('Forbidden');

  let content;

  if (type === nodeTypeEnum.part)
    content = await partModel.findById(node.content);

  if (!content) return res.status(404).send("Part Not Found");

  const chemin = path.join(config.files3D, part.path, partFileSystem.data);

  try {
    await deleteFile(path.join(chemin, file))
    return res.status(200).send();
  } catch (error) {
    log.error(error);
    return res.status(500).send('Intern Error');
  }
}

module.exports = deleteTexture;
