const nodeSchema = require('../../../models/Node');
const partSchema = require('../../../models/Part');
const fs = require('fs');
const path = require('path');
const config = require('../../../config/server');
const PartFileSystem = require('../../../config/PartFileSystem');
const log = require('../../../utils/log');
const util = require('util');

async function getTextureFile(req, res) {
  try {
    const { nodeId, texture } = req.params;

    const node = await nodeSchema.findById(nodeId)
    if (!node) return res.status(404).send('Node Not Found');
    const part = await partSchema.findById(node.content)
    if (!part) return res.status(404).send('Part Not Found');

    const textureFile = path.join(config.files3D, part.path, PartFileSystem.data, path.basename(texture));

    return res.sendFile(textureFile);
  } catch (error) {
    log.error(err);
    return res.status(500).send('Intern Error');
  }
}

module.exports = getTextureFile
