const co = require('co');
const workspaceSchema = require('../../models/Workspace');
const nodeSchema = require('../../models/Node')
const log = require('../../utils/log');

module.exports = function* () {
  const cursor = workspaceSchema.find().cursor();
  const length = yield workspaceSchema.count();
  let i = 0;
  for (let workspace = yield cursor.next(); workspace !== null; workspace = yield cursor.next()) {
    log.info(`[FetchTheWorkspaceNode] - ${i + 1}/${length}`);
    yield addWorkspace(workspace._id, workspace.nodeMaster);
    i++;
  }
};

function* addWorkspace(workspaceId, nodeId) {
  const node = yield nodeSchema.findById(nodeId);

  const doc = node._doc

  node.Workspace = workspaceId;

  yield changePathContent(content);

  node.path = `${node.Organization}/${node._id}`
  yield node.save();
  for (let i = 0; i < node.children.length; i++) {
    yield addWorkspace(workspaceId, Wnode.children[i]._id);
  }
}

function* changePathContent(content) {
  
  content.Organization = doc.ownerOrganization._id
  const ancientPath = `/1${content.Organization}/${content.name} - ${content._id}`
  const newPath = `${content.Organization}/${content._id}`
  const directoryOrganization = path.join(config.files3D, ancientPath);
  const newDirectoryOrganization = path.join(config.files3D, newPath);
  yield renameDir(directoryOrganization, newDirectoryOrganization);
}
