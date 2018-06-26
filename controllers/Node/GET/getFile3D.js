const nodeSchema = require('../../../models/Node');
const partSchema = require('../../../models/Part');
const fs = require('fs');
const path = require('path');

const config = require('../../../config/server');
const PartFileSystem = require('../../../config/PartFileSystem');
const log = require('../../../utils/log');
const util = require('util');
const promisifyReaddir = util.promisify(fs.readdir);
const constants = require('../../../enum/NodeTypeEnum');

module.exports = async function (req, res, next) {
  try {
    const { nodeId } = req.params;
    const { currentWorkspace } = req.session;

    const { content, type } = await nodeSchema.findById(nodeId);

    if (type !== constants.part) throw new Error(`[Node] - Cannot Fetch the file 3D, the type of the node is ${type}`);

    const part = await partSchema.findById(content);

    const partDirectory = path.join(config.files3D, part.path, PartFileSystem.data);

    let files = await promisifyReaddir(file3Ddirectory);

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (path.extname(file) === '.json') {
        const destination = path.join(file3Ddirectory, file);
        return res.sendFile(destination);
      }
    }
  } catch (error) {
    log.error(error);
    return res.status(404).send('Not Found');
  }
}
