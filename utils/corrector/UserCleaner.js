const co = require('co');
const userSchema = require('../../models/User');
const workspaceSchema = require('../../models/Workspace');

co(function* () {
  const cursor = userSchema.find().cursor();
  for (let user = yield cursor.next(); user !== null; user = yield cursor.next()) {
    if (user.workspaces) {
      let nestedWorkspace = user.workspaces;
      for (let i = 0; i < nestedWorkspace.length; i++) {
        let workspace = yield workspaceSchema.findById(nestedWorkspace._id);
        let indice = user.Organization.findIndex(({ _id }) => String(_id) === String(workspace.Organization));
        if (indice)
          user.Organization[indice].workspaces.push(workspace._id);
            else {
              user.Organization.push({
                _id: workspace.Organization,
                workspaces: [workspace._id]
              });    
            } 
      }  
    }
    yield user.save();
  }
});
