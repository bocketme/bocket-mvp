const nodeSchema = require('../../../models/Node');
const partSchema = require('../../../models/Part');
const fs = require('fs');
const path = require('path');
const config = require('../../../config/server');
const PartFileSystem = require('../../../config/PartFileSystem');
const log = require('../../../utils/log');
const util = require('util');
const promisifyReaddir = util.promisify(fs.readdir);

const getFile3D = async function getFile3D(req, res) {
  try {
    const { nodeId } = req.params;
    const workspaceId = req.session.currentWorkspace;
  
    const node = await nodeSchema.findById(nodeId)
    if (!node) return res.status(404).send('Node Not Found');
    const part = await partSchema.findById(node.content)
    if (!part) return res.status(404).send('Part Not Found');
  
    const file3Ddirectory = path.join(config.files3D, part.path, PartFileSystem.data);
  
    let files = await promisifyReaddir(file3Ddirectory)
      .catch(err => {
        throw (err)
      });
    for (let i = 0; i < files.length; i++) {
      if (path.extname(files[i]) === '.json')
        return res.sendFile(path.join(file3Ddirectory, files[i]));
    }
    return res.status(404).send('Not Found');      
  } catch (error) {
    log.error(error)
    res.status(500).send("Intern Error");
  }
}

module.exports = getFile3D;
