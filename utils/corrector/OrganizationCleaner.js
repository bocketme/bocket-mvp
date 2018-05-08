const co = require('co');
const organizationSchema = require('../../models/Organization');
const log = require('../log');

co(function* () {
  const cursor = organizationSchema.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {

    if (doc.workspaces !== null) {
      doc.Workspaces = doc.workspaces.map(({ _id }) => _id);
      delete doc.workspace;
    }
    if (doc.node !== null)
      delete doc.node;

    if (doc.team !== null)
      delete doc

    if (doc.owner !== null){
      const owner = doc.owner.map(({ _id }) => _id);
    doc.Owner = owner[0];
    delete doc.owner;
    }

    if (doc.members !== null) {
      const members = doc.members.map(({ _id }) => _id);
      doc.Members = doc.members.filter(member => String(member) !== String(owner));
      delete doc.members  
    }
    yield doc.save();
  }
});
