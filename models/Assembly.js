const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const TypeEnum = require('../enum/NodeTypeEnum');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const NestedComment = require("./nestedSchema/NestedActivitySchema");
const configServer = require("../config/server");
const fs = require('fs');
const path = require('path');
const util = require('util');

const readDir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

let NestedOrganization = mongoose.Schema({
    _id: {type:  mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let AssemblyScheama = mongoose.Schema({
    name: {type: String, require: true},

    //TODO: Access To Assembly => Issue
    //owners: {type: [nestedOwners], default: []}

    description: {type: String, default: "No description aviable"},
    path: { type:String },
    //TODO: Object To Assembly ?? => Issue
    object: {type: Object, default: {}},

    ownerOrganization: {type: NestedOrganization, require: true},
    maturity: {type: String, default: TypeEnum.maturity[0]},
    quality: {type: Number, default:0},
    whereUsed: {type: [String], default: []},

    //Update tags unused for the 1.0
    tags: {type: [], default: []},

    annotation: {type: [NestedAnnotation], default: []},
    activities : {type: [NestedComment], default: []}
});

/*
AssemblyScheama.pre('save', function(next) {
    if(!assembly.path) {
        assembly.path = '/' + assembly.ownerOrganization.name + '/' + assembly.name + ' - ' + assembly._id;
        let assemblyPath = path.join(configServer.files3D, assembly.path);
        fs.access(assemblyPath, err => {
            if (!err)
                return next();
            fs.mkdir(assemblyPath, (err)=> {
                if (err)
                    return next(err);
                return next();
            });
        });
    }
    return next();
});

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


