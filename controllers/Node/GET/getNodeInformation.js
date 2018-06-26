const nodeSchema = require('../../../models/Node');
const partSchema = require('../../../models/Part');
const assemblySchema = require('../../../models/Assembly');
const workspaceSchema = require('../../../models/Workspace');

const path = require('path')
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

const { CHEMIN, FILE_SUPPORTED, NODE_TYPE } = require('../../../constants');
const { EXTENSION_3D } = FILE_SUPPORTED

module.exports = async function (req, res, next) {
  try {
    const response = {};
    const { nodeId } = req.params;
  
    const node = await nodeSchema.findById(nodeId);
    if (!node) throw new Error('Cannot Find The Node');
  
    response.name = node.name;
    response.description = node.description;
  
    const { Workspace, content, type } = await nodeSchema.findById(nodeId);
  
    let mainDirectory;
  
    if (type === NODE_TYPE.PART) {
      const part = await partSchema.findById(content);
      if (!part) throw new Error('[NODE] - GET THE NODE INFORMATION : The part cannot be fetched');
      mainDirectory = path.join(config.files3D, part.path);
      response.files = await fetchAllFiles(mainDirectory, NODE_TYPE.PART);
    } else if (type === NODE_TYPE.ASSEMBLY) {
      const assembly = await assemblySchema.findById(content);
      if (!assembly) throw new Error('[NODE] - GET THE NODE INFORMATION : The assembly cannot be fetched');
      mainDirectory = path.join(config.files3D, assembly.path);
      response.files = await fetchAllFiles(mainDirectory, NODE_TYPE.ASSEMBLY);
    } else throw new Error(`[NODE] - GET THE NODE INFORMATION : THE NODE IS NOR AN ${NODE_TYPE.PART} OR AN ${NODE_TYPE.ASSEMBLY}, BUT AN ${type}`)
  
  
    const workpsace = await workspaceSchema
      .findById(Workspace)
      .populate('ProductManagers')
      .populate('Teammates')
      .populate('Observers')
      .exec();
  
    responses.users = workspace.users;
  
    res.json(response);  
  } catch (err) {

  }
}

async function fetchAllFiles(chemin, type) {
  const directorySpec = await readdir(path.join(chemin, CHEMIN.CONTENT.SPEC))
  switch (type) {
    case NODE_TYPE.PART:
      const directory3D = await readdir(path.join(chemin, CHEMIN.CONTENT["3D"]));
      return {
        file3D: directory3D.find(include3D),
        Texture: directory3D.filter(!include3D),
        Specifications: directorySpec
      }
    case NODE_TYPE.ASSEMBLY:
      const directorySpec = await readdir(path.join(chemin, CHEMIN.CONTENT.SPEC));
      return { Specifications: directorySpec }
    default:
      throw new Error('[NODE] - GET THE NODE INFORMATION : TYPE INCORRECT');
  }
}

function include3D(chemin) {
  const ext = path.extname(chemin);
  return EXTENSION_3D.includes(ext.toLowerCase());
}
