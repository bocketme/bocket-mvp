const co = require('co');
const organizationSchema = require('../../models/Organization');
const workspaceSchema = require('../../models/Workspace');
const userSchema = require('../../models/User')
const log = require('../log');

co(function* () {
  const cursor = organizationSchema.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    // Print the user, with the `band` field populated
    log.info('Organization Found');
    if (doc.creation) log.info('Date already created, go to next');
    else {
      const { workspaces, owner } = doc;
      if (!workspaces || workspaces.length === 0) {
        return log.info('workpsaces empty, cannot found the date, check the user creation');
        const user = yield userSchema.findById(owner._id);
        doc.creation = user.createDate;
        yield doc.save();
      } else {
        log.info('Workspaces Found');
        const workspace = yield workspaceSchema.findById(workspaces[0]._id);
        doc.creation = workspace.creation
        yield doc.save();
      }  
    }
  }
});
