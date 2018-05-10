const co = require('co');
const workspaceSchema = require('../../models/Workspace');

module.exports = function* () {
  const cursor = workspaceSchema.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    const workspace = doc._id;
    if (workspace.node_master) {
      doc.nodeMaster = workspace.node_master._id;
      doc.node_master = null;
      yield doc.save();
    }
  }
};
