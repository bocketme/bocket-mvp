const co = require('co');
const { UserModel, WorkspaceModel, OrganizationModel } = require("../backup")
const log = require('../../utils/log');

module.exports = function* () {
  const cursor = UserModel.find().cursor();
  const length = yield UserModel.count();
  let i = 0;
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    log.info(`(${i + 1}/${length}) - [UserCleaner] Started`);
    const user = doc.toObject();
    if (user.workspaces) {
      let nestedWorkspace = user.workspaces;
      for (let i = 0; i < nestedWorkspace.length; i++) {
        const manager = user.Manager
        const workspace = yield WorkspaceModel.findById(nestedWorkspace[i]._id);
        const organization = yield OrganizationModel.findOne({ 'Workspaces': doc._id });
        const isExisting = manager.findIndex(({ Organization }) => Organization.equals(organization._id));
        if (isExisting === -1) {
          doc.Manager.push({
            _id: organization._id,
            workspaces: [workspace._id],
          });
        } else {
          doc.Manager[isExisting].workspaces.push(workspace._id)
        }
      }
    }
    yield doc.save();
    log.info(`(${i + 1}/${length}) - [UserCleaner] Finished`);
    i++;
  }
};
