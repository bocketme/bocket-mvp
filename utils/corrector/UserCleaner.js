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
        let workspace = yield workspaceSchema.findById(nestedWorkspace._id);
        const Organization = user.get('Organization');
        const isExisting = Organization.findIndex(({_id}) => String(_id) ===  String(workspace.Organization));
        if(isExisting && isExisting !== -1) {
          doc.Organization[isExisting].workspaces.push(workspace._id)
        } else {
          const organization = yield organizationSchema.findById(workspace.Organization);
          const userRights = organization.findUserRights(doc._id);
          user.Organization.push({
            _id: workspace.Organization._id,
            isOwner: userRights > 4,
            workspaces: [workspace._id],
          });
        }
      }
    }
    yield doc.save();
  }
};
