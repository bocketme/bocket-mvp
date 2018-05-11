const organizationSchema = require('../../models/Organization');
const log = require('../log');

module.exports = function* () {
  const cursor = organizationSchema.find().cursor();
  for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
    const organization = doc._doc;
    if (organization.workspaces) {
      const workspaces = doc.get('workspaces');
      doc.Workspaces = workspaces.map(({ _id }) => _id);
      doc.workspaces = null;
      yield doc.save();
    }

    if (organization.node)
      doc.node = null;

    if (organization.team)
      doc.team = null;

    if (organization.owner) {
      const owner = organization.owner[0]._id;
      doc.Owner = owner;
      doc.owner = null;
    }

    if (organization.members) {
      const members = organization.members;
      doc.members = null;
      doc.Members =
        members.filter((member) => {
          const id1 = String(member);
          const id2 = String(organization.owner[0]._id);
          return id1 !== id2;
        });
    }
    yield doc.save()
  }
};
