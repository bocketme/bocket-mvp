const co = require('co');
const userSchema = require('../../models/User');
const workspaceSchema = require('../../models/Workspace');
const organizationSchema = require('../../models/Organization');

module.exports = function* () {
  const cursor = userSchema.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    const user = doc._doc;
    if (user.workspaces) {
      let nestedWorkspace = user.workspaces;
      for (let i = 0; i < nestedWorkspace.length; i++) {
        let workspace = yield workspaceSchema.findById(nestedWorkspace[i]._id);
        const manager = user.get('Manager');
        const organization = yield organizationSchema.findOne({ 'Workspaces': doc._id });
        const isExisting = manager.findIndex(({ Organization }) => {
          const id1 = String(Organization);
          const id2 = String(organization._id);
          return id1 === id2;
        });
        if (isExisting == -1) {
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
  }
  console.log('end');
};
