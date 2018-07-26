const nodeModel = require('../../../models/Node');
const assemblyModel = require('../../../models/Assembly');
const workspaceModel = require('../../../models/Workspace');
const userModel = require('../../../models/User');
const partModel = require('../../../models/Part');
const config = require('../../../config/server');
const fs = require('fs');
const nodeTypeEnum = require('../../../enum/NodeTypeEnum');
const log = require('../../../utils/log');
const partFileSystem = require("../../../config/PartFileSystem");
const _ = require('lodash');

const util = require('util');

const readdir = util.promisify(fs.readdir);

const path = require('path');

async function information(req, res) {
  try {
    const { nodeId } = req.params;

    const node = await nodeModel.findById(nodeId);

    if (!node) return res.status(404).send('Not Found');

    const workspace = await workspaceModel
      .findById(node.Workspace);

    const { userId } = req.session;
    const rights = workspace.hasRights(userId);

    if (!rights || rights === 1)
      return res.status(403).send('Forbidden');

    let content, files;

    if (node.type === nodeTypeEnum.part) {
      content = await partModel.findById(node.content);

      if (!content) return res.status(404).send("Part Not Found");

      const directory = {
        "3D": path.join(config.files3D, content.path, partFileSystem.data),
        "Spec": path.join(config.files3D, content.path, partFileSystem.spec)
      }

      const directoryFiles = {
        "3D": [...await readdir(directory["3D"])].map(file => ({ name: file, extname: path.extname(file), type: "MODELES_3D_FILES" })),
        "Spec": [...await readdir(directory["Spec"])].map(file => ({ name: file, extname: path.extname(file), type: "SPECIFICATION" }))
      }

      directoryFiles["3D"] = directoryFiles["3D"].filter(({ extname }) => extname !== ".json");

      files = [...directoryFiles["3D"], ...directoryFiles["Spec"]];
    } else {
      content = await assemblyModel.findById(node.content);

      if (!content) return res.status(404).send("Assembly Not Found");

      const directory = path.join(config.files3D, content.path, partFileSystem.spec);

      files = [...await readdir(directory)].map(file => ({ name: file, type: "SPECIFICATION" }));
    }

    const workInNode = workspace.listNodeAccess(nodeId);
    const promises = workspace.users.map(userId => userModel.findById(userId).select('completeName').exec());
    const userList = await Promise.all(promises);

    const workers = userList.map(worker => {
      function findWorker(workId) {
        return workId.equals(worker._id)
      }
      const workHere = workInNode.find(findWorker);
      return ({ ...worker.toObject(), workHere })
    })


    res.json({
      files,
      workers,
      info: {
        name: node.name,
        description: node.description
      },
      typeofNode: node.type
    })

  } catch (error) {
    log.error(error);
    res.status(500).send('Intern Error')
  }
}

module.exports = information;
