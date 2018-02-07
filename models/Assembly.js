const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const TypeEnum = require('../enum/NodeTypeEnum');
const NestedAnnotation = require('./nestedSchema/NestedAnnotation');
const NestedComment = require("./nestedSchema/NestedActivitySchema");
const configServer = require("../config/server");
const fs = require('fs');
const path = require('path');

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
    tags: {type: [], default: []},
    annotation: {type: [NestedAnnotation], default: []},
    activities : {type: [NestedComment], default: []}
});

AssemblyScheama.post('save', (assembly, next) => {
    if(!assembly.path) {
        assembly.path = '/' + assembly.ownerOrganization.name + '/' + assembly.name + ' - ' + assembly._id;
        let assemblyPath = path.join(configServer.files3D, assembly.path);
        fs.access(assemblyPath, err => {
            if (!err)
                return next();
            fs.mkdir(assemblyPath, (err)=> {
                if (err)
                    return next(err);
                return next()
            })
        })
    }
    return next()
});

AssemblyScheama.statics.newDocument = (assemblyInformation) => {
    return new Assembly(assemblyInformation);
};

AssemblyScheama.plugin(uniqueValidator);

let Assembly = mongoose.model("Assembly", AssemblyScheama, "Assemblies");

module.exports = Assembly;

