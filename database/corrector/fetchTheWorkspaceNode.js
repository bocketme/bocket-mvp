const { WorkspaceModel, NodeModel } = require('../backup');
const log = require('../../utils/log');
const fs = require('fs');
const util = require('util');
const path = require('path');
const renameDir = util.promisify(fs.rename);

module.exports = function* () {
  const cursor = WorkspaceModel.find().cursor();
  const length = yield WorkspaceModel.count();
  let i = 0;
  for (let workspace = yield cursor.next(); workspace !== null; workspace = yield cursor.next()) {
    log.info(`[FetchTheWorkspaceNode] - ${i + 1}/${length}`);
    yield addWorkspace(workspace._id, workspace.nodeMaster);
    i++;
  }
};

function* addWorkspace(workspaceId, nodeId) {
  const node = yield NodeModel.findById(nodeId);

  if (!node) return null;


  node.Workspace = workspaceId;

  if (node.ownerOrganization)
    yield changePathContent(node.content, node.ownerOrganization._id);

  node.path = `${node.Organization}/${node._id}`;
  yield node.save();
  for (let i = 0; i < node.children.length; i++) {
    yield addWorkspace(workspaceId, node.children[i]._id);
  }
}

function* changePathContent(content, ownerOrganizationId) {

  log.info(ownerOrganizationId);
  content.Organization = ownerOrganizationId;
  const ancientPath = `/1${content.Organization}/${content.name} - ${content._id}`;
  const newPath = `${content.Organization}/${content._id}`;
  const directoryOrganization = path.join(config.files3D, ancientPath);
  const newDirectoryOrganization = path.join(config.files3D, newPath);
  yield renameDir(directoryOrganization, newDirectoryOrganization);
}
