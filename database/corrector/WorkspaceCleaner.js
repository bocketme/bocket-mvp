const co = require('co');
const workspaceSchema = require('../../models/Workspace');
const orgniaztionSchema = require('../../models/Organization');
const log = require('../../utils/log');

module.exports = function* () {
  const cursor = workspaceSchema.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    try {
      const workspace = doc.toObject({ getters: false, transform: false });

      if (workspace.node_master) {
        doc.nodeMaster = workspace.node_master._id;
        yield doc.save();
      }
      
      if (workspace.users) {
        const users = workspace.users;
        if (workspace.owner) {
          const owner = workspace.owner[0];
          doc.ProductManagers = [owner._id];
        } else {
          const organization = yield orgniaztionSchema.findOne({ "Workspaces": doc._id });
          doc.ProductManagers = [organization.Owner];
        }
        const usersId = users.map(user => user._id);
        doc.Teammates = usersId.filter(user => {
          const id = String(user);
          const filter = String(owner._id);
          return id !== filter;
        });
        yield doc.save();
      }
    } catch (error) { log.error(error) }
  }
};
