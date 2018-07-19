const nodeModel = require('../../../models/Node');
const workspaceModel = require('../../../models/Workspace');
const partModel = require('../../../models/Part');
const config = require('../../../config/server');
const fs = require('fs');
const nodeTypeEnum = require('../../../enum/NodeTypeEnum');
const log = require('../../../utils/log');
const partFileSystem = require("../../../config/PartFileSystem");

const util = require('util');

const readdir = util.promisify(fs.readdir);

const path = require('path');
async function information(req, res) {
  try {
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

    const directory = {
      "3D": path.join(config.files3D, part.path, partFileSystem.data),
      "Spec": path.join(config.files3D, part.path, partFileSystem.spec)
    }

    const directoryFiles = {
      "3D": await readdir(directory["3D"]),
      "Spec": await readdir(directory["Spec"])
    }

    const files = [...directoryFiles["3D"], ...directoryFiles["Spec"]];

    const workers = []

    res.json({
      files,
      workers,
      info: {
        name: node.name,
        description: node.description
      }
    })

  } catch (error) {
    log.error(error);
    res.status(500).send('')
  }
}
