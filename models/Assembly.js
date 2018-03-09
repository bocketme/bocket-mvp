const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const TypeEnum = require('../enum/NodeTypeEnum');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const NestedComment = require("./nestedSchema/NestedActivitySchema");
const NestedUser = require("./nestedSchema/NestedUserSchema");
const configServer = require("../config/server");
const fs = require('fs');
const path = require('path');
const util = require('util');
const AssemblyFileSystem = require('../config/AssemblyFileSystem');

const readDir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

/** 
 * Mongoose Schema for 
 * @param {number} _id - The id of the nested organization
 * @param {string} name - The name of the organization
*/
let NestedOrganization = mongoose.Schema({
    _id: {type:  mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let AssemblyScheama = mongoose.Schema({
    name: {type: String, require: true, index: true},

    //TODO: Access To Assembly => Issue
    //owners: {type: [nestedOwners], default: []}

    description: {type: String, default: "No description aviable", index: true},
    path: { type:String },
    ownerOrganization: {type: NestedOrganization, require: true},
    maturity: {type: String, default: TypeEnum.maturity[0]},
    quality: {type: Number, default:0},
    whereUsed: {type: [String], default: []},
    creator: {type: NestedUser, require: true},

    //Update tags unused for the 1.0
    tags: {type: [], default: []},

    annotation: {type: [NestedAnnotation], default: []},
    creator: {type: NestedUser, require: true},
    activities : {type: [NestedComment], default: []}
});

function mkdirPromise(path) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path, (err) => {
      if (err)
        reject(err);
      else resolve();
    })
  })
}

AssemblyScheama.pre('validate', function(next) {
  if (this.path)
    return next();

  this.path = '/' + this.ownerOrganization.name + '-' + this.ownerOrganization._id + '/' + this.name + ' - ' + this._id;
  let assemblyPath = path.join(configServer.files3D, this.path);

  mkdirPromise(assemblyPath)
    .then(() => {
      let promises = [];
      for (let directory in AssemblyFileSystem) {
        promises.push(
          mkdirPromise(path.join(assemblyPath, AssemblyFileSystem[directory]))
        );
      }
      return Promise.all(promises);
    })
    .then(() => {
      return next()
    })
    .catch(err => {
      return next(err)
    });
});

/*
AssemblyScheama.pre("remove", function (next) {
    if (!this.path)
        return next(new Error("[Critical Error] : The Assembly has no path"));

    deleteFolderRecursive(this.path)
        .then(() => next())
        .catch(err => next(err));
});

const deleteFolderRecursive = async function(path) {
    let elements = await readDir(path);

    let promises = [];

    elements.forEach(element => {
        let currentPath = path.join(path, element);

        if(fs.stat(currentPath).isDirectory())
            promises.push(deleteFolderRecursive(currentPath));
        else
            promises.push(unlink(currentPath));
    });

    Promise.all(promises)
        .then(() => resolve())
        .catch(err => reject(err));
};
*/

AssemblyScheama.statics.newDocument = (assemblyInformation) => {
    return new Assembly(assemblyInformation);
};

AssemblyScheama.plugin(uniqueValidator);

let Assembly = mongoose.model("Assembly", AssemblyScheama, "Assemblies");
module.exports = Assembly;


