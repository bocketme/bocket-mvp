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
        const OrganizationManager = user.get('Organization');
        const organization = yield organizationSchema.findOne({ 'Workspaces': doc._id });
        const isExisting = OrganizationManager.findIndex(({_id}) => {
          const id1 = String(_id);
          const id2 = String(organization._id);
          return id1 === id2;
        });
        if(isExisting && isExisting !== -1) {
          doc.Organization[isExisting].workspaces.push(workspace._id);
        } else {
           user.Organization.push({
             _id: organization._id,
            workspaces: [workspace._id],
          });
        }
      }
    }
    yield doc.save();
  }
  console.log('end');
};
