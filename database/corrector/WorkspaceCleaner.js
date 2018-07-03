const co = require('co');
const { WorkspaceModel, OrganizationModel } = require('../backup')
const log = require('../../utils/log');

module.exports = function* () {
  const cursor = WorkspaceModel.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    try {
      const workspace = doc.toObject();

      if (workspace.node_master) {
        doc.nodeMaster = workspace.node_master._id;
        yield doc.save();
      }

      if (workspace.organization)
        workspace.Organization = workspace.organization._id

      if (workspace.users) {
        const users = workspace.users;
        if (workspace.owner) {
          const owner = workspace.owner[0];
          if (owner._id) {
            const organization = yield OrganizationModel.findOne({ "Workspaces": doc._id });
            doc.ProductManagers = [organization.Owner];
          }
        } else {
          const organization = yield OrganizationModel.findOne({ "Workspaces": doc._id });
          doc.ProductManagers = [organization.Owner];
        }
        const usersId = users.map(user => user._id);
        doc.Teammates = usersId.filter(user => {
          const id = String(user);
          const filter = String(doc.ProductManagers[0]._id);
          return id !== filter;
        });
        yield doc.save();
      }
    } catch (error) { log.error(error) }
  }
};
