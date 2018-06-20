const organizationSchema = require('../../models/Organization');
const log = require('../../utils/log');
const fs = require('fs');
const util = require('util');
const path = require('path');
const config = require('../../config/server');

const renameDir = util.promisify(fs.rename);
module.exports = function* () {
  try {
    const cursor = organizationSchema.find().cursor();
    for (let doc = yield cursor.next(); doc !== null; doc = yield cursor.next()) {
      const organization = doc._doc;
      if (organization.workspaces) {
        const workspaces = organization.workspaces;
        doc.Workspaces = workspaces.map(({ _id }) => _id);
        doc.workspaces = null;
        yield doc.save();
      }

      try {
        const directoryOrganization = path.join(config.files3D, `${doc.name}-${doc._id.toString()}`);
        const newDirectoryOrganization = path.join(config.files3D, doc._id.toString());
        yield renameDir(directoryOrganization, newDirectoryOrganization);          
      } catch (err) {
        log.error(new Error('[Correction] - Organization : Cannot change the name of the directory ...skipping \n' + err))
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
  } catch (error) {
    log.error(error)
  }
};
