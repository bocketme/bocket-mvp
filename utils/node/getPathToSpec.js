const Organization = require('../../models/Organization');
const Workspace = require('../../models/Workspace');
const getContentOfNode = require('./getContentOfNode');
const path = require('path');
const serverConfig = require('../../config/server');
const PartFileSystemConfig = require('../../config/PartFileSystem');

const functionName = 'getPathToSpec';

async function gePathToSpec(nodeId, workspaceId) {
  const { content } = await getContentOfNode(nodeId);
  if (!content) throw Error(`${functionName}: unknown content`);
  const workspace = await Workspace.findById(workspaceId);
  const organization = await Organization.findOne(workspace.organization._id);
  if (!organization) throw Error(`${functionName}: unknown organization`);
  return path.join(serverConfig.files3D, `${organization.name}-${organization._id}`, `${content.name} - ${content._id}`, PartFileSystemConfig.spec);
}

module.exports = gePathToSpec;
