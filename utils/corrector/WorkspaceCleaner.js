const co = require('co');
const workspaceSchema = require('../../models/Workspace');

co(function* () {
  const cursor = workspaceSchema.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    if (doc.node_master) {
      doc.nodeMaster = doc.node_master._id;
      delete doc.node_master;
      yield doc.save();  
    }
  }
});
