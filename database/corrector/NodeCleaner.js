const workspaceSchema = require('../../models/Workspace');
const log = require('../../utils/log');


//Need Rework
module.exports = function* () {
  const cursor = workspaceSchema.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    const workspace = doc.toObject();

    if (workspace.node_master) {
      doc.nodeMaster = workspace.node_master._id;
      yield doc.save();
    }

    const users = workspace.users;
    const owner = workspace.owner;

    if (users) {
      doc.ProductManagers = [owner._id];
      let usersId = users.map(({ _id }) => _id);
      doc.Teammates = usersId.filter(user => {
        const id = String(user);
        const filter = String(owner._id);
        return id !== filter;
      });
      yield doc.save();
    }
  }
};
