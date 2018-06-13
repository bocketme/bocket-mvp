const co = require('co');
const workspaceSchema = require('../../models/Workspace');
const nodeSchema = require('../../models/Node')
const log = require('../log');

module.exports = function* () {
  const cursor = workspaceSchema.find().cursor();
  for (const workspace = yield cursor.next(); workspace !== null; workspace = yield cursor.next()) {
    yield addWorkspace(workspace._id, workspace.nodeMaster);
  }
};

function* addWorkspace(workspaceId, nodeId) {
  const node = yield nodeSchema.findById(nodeId);
  node.Workspace = workspaceId;
  await node.save();
  for (let i = 0; i < node.children.length; i++) {
    yield addWorkspace(workspaceId, Wnode.children[i]._id);
  }
}
