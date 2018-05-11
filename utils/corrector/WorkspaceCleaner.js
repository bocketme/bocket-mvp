const co = require('co');
const workspaceSchema = require('../../models/Workspace');

module.exports = function* () {
  const cursor = workspaceSchema.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    const workspace = doc._id;
    if (workspace.node_master) {
      const nodeMaster = doc.get('node_master._id');
      doc.nodeMaster = nodeMaster;
      doc.node_master = null;
      yield doc.save();
    }
    
    const users = workspace.users;
    const owner = workspace.owner;
  if(users) {
    console.log(users)
    console.log(owner)
      doc.ProductManagers = [owner];
      let usersId = users.map(user => user._id);
      doc.Teammates = usersId.filter(user => {
        const id = String(user);
        const filter = String(owner);
        return id !== filter;
      });
      doc.users = undefined;
      doc.owner = undefined;
      yield doc.save();     
    }
  }
};
