const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const TypeEnum = require('../enum/NodeTypeEnum');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const NestedComment = require('./nestedSchema/NestedActivitySchema');
const NestedUser = require('./nestedSchema/NestedUserSchema');
const configServer = require('../config/server');
const fs = require('fs');
const path = require('path');
const AssemblyFileSystem = require('../config/AssemblyFileSystem');

const directories = Object.values(AssemblyFileSystem);

/**
 * Mongoose Schema for
 * @param {number} _id - The id of the nested organization
 * @param {string} name - The name of the organization
*/
const NestedOrganization = mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId, require: true },
  name: { type: String, require: true },
});

const AssemblyScheama = mongoose.Schema({
  name: { type: String, require: true, index: true },

  // TODO: Access To Assembly => Issue
  // owners: {type: [nestedOwners], default: []}

  description: { type: String, default: 'No description aviable', index: true },
  path: { type: String },
  ownerOrganization: { type: NestedOrganization, require: true },
  maturity: { type: String, default: TypeEnum.maturity[0] },
  quality: { type: Number, default: 0 },
  whereUsed: { type: [String], default: [] },
  creator: { type: NestedUser, require: true },

  // Update tags unused for the 1.0
  tags: { type: [], default: [] },

  annotation: { type: [NestedAnnotation], default: [] },
  activities: { type: [NestedComment], default: [] },
});

function mkdirPromise(chemin) {
  return new Promise((resolve, reject) => {
    fs.mkdir(chemin, (err) => {
      if (err) { reject(err); } else resolve();
    });
  });
}

AssemblyScheama.pre('validate', function (next) {
  if (this.path) { return next(); }

  this.path = `/${this.ownerOrganization.name}-${this.ownerOrganization._id}/${this.name} - ${this._id}`;
  const assemblyPath = path.join(configServer.files3D, this.path);

  mkdirPromise(assemblyPath)
    .then(() => {
      const promises = [];

      directories.forEach((directory) => {
        promises.push(mkdirPromise(path.join(assemblyPath, directory)));
      });
      return Promise.all(promises);
    })
    .then(() => next())
    .catch(err => next(err));
  return null;
});

AssemblyScheama.statics.newDocument = assemblyInformation => new Assembly(assemblyInformation);

AssemblyScheama.plugin(uniqueValidator);

const Assembly = mongoose.model('Assembly', AssemblyScheama, 'Assemblies');

module.exports = Assembly;
