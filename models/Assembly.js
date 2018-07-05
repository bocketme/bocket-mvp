const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const TypeEnum = require('../enum/NodeTypeEnum');
const NestedComment = require('./nestedSchema/NestedActivitySchema');
const configServer = require('../config/server');
const fs = require('fs');
const path = require('path');
const AssemblyFileSystem = require('../config/AssemblyFileSystem');
const { Schema } = mongoose;
const directories = Object.values(AssemblyFileSystem);

const AssemblyScheama = mongoose.Schema({
  name: { type: String, require: true, index: true },

  // TODO: Access To Assembly => Issue
  description: { type: String, default: 'No description aviable', index: true },
  path: { type: String },
  maturity: { type: String, default: TypeEnum.maturity[0] },
  quality: { type: Number, default: 0 },
  //TODO: Script to fill the data
  Creator: { type: Schema.Types.ObjectId, require: true, ref: 'User' },

  // Update tags unused for the 1.0
  tags: { type: [], default: [] },

  activities: { type: [NestedComment], default: [] },
  Organization: { type: mongoose.SchemaTypes.ObjectId, required: true, ref: 'Organization' }
});

function mkdirPromise(chemin) {
  return new Promise((resolve, reject) => {
    fs.mkdir(chemin, (err) => {
      if (err) { reject(err); } else resolve();
    });
  });
}

AssemblyScheama.pre('save', function (next) {
  if (this.path) { return next(); }

  this.path = `/${this.Organization}/${this._id}`;
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
