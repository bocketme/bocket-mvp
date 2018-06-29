const nodeSchema = require('../../models/Node');
const partSchema = require('../../models/Part');
const fs = require('fs');
const path = require('path');
const config = require('../../config/server');
const PartFileSystem = require('../../config/PartFileSystem');
const log = require('../../utils/log');
const util = require('util');
const promisifyReaddir = util.promisify(fs.readdir);

async function getFile3D(nodeId, workspaceId) {
  const node = await nodeSchema.findById(nodeId)
    .catch(err => {
      throw (err)
    });
  if (!node) return null;
  const part = await partSchema.findById(node.content)
    .catch(err => {
      throw (err)
    });
  if (!part) return null;

  const file3Ddirectory = path.join(config.files3D, part.path, PartFileSystem.data);

  let files = await promisifyReaddir(file3Ddirectory)
    .catch(err => {
      throw (err)
    });
  for (let i = 0; i < files.length; i++) {
    if (path.extname(files[i]) === '.json') {
      return path.join(file3Ddirectory, files[i]);
      break;
    }
  }
  return null
}

async function getTextureFile(nodeId, workspaceId, textureName) {
  const node = await nodeSchema.findById(nodeId)
    .catch(err => {
      log.error(err);
      throw (err)
    });
  if (!node) return null;

  const part = await partSchema.findById(node.content)
    .catch(err => {
      throw (err)
    });
  if (!part) return null;
  return path.join(config.files3D, part.path, PartFileSystem.data, path.basename(textureName))
}

module.exports = {
  getFile3D: (req, res) => {
    const {
      nodeId
    } = req.params;
    const workspaceId = req.session.currentWorkspace;
    Promise.resolve(getFile3D(nodeId, workspaceId))
      .then((file3D) => {
        if (file3D) res.sendFile(file3D);
        else res.status(404).send('Not Found')
      })
      .catch(err => {
        log.error(err);
        res.status(404).send('Not Found');
      })
  },
  getFileTexture: (req, res) => {
    const {
      nodeId,
      texture
    } = req.params;
    const workspaceId = req.session.currentWorkspace;
    Promise.resolve(getTextureFile(nodeId, workspaceId, texture))
      .then((textureFile) => {
        if (textureFile) res.sendFile(textureFile);
        else res.status(403).send('Bad Request')
      })
      .catch(err => {
        log.error(err);
        res.status(404).send('Not Found');
      })
  }
};
