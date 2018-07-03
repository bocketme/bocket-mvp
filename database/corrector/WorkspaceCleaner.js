const co = require('co');
const { WorkspaceModel, OrganizationModel } = require('../backup')
const log = require('../../utils/log');

module.exports = function* () {
  const cursor = WorkspaceModel.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    try {
      const workspace = doc.toObject();

      if (doc.node_master)
        doc.nodeMaster = doc.node_master._id;


      if (doc.organization)
        workspace.Organization = workspace.organization._id;

      const organization = yield OrganizationModel.findOne({ "Workspaces": doc._id });
      log.info(organization !== null);
      doc.ProductManagers = [organization.Owner];

      if (doc.users) {
        const users = workspace.users;
        const usersId = users.map(user => user._id);
        doc.Teammates = usersId.filter(user => {
          const id = String(user);
          const filter = String(doc.ProductManagers[0]._id);
          return id !== filter;
        });
      }


      yield doc.save();
    } catch (error) { log.error(error) }
  }
};
