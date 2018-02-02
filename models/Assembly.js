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
    tags: {type: [], default: []},
    annotation: {type: [NestedAnnotation], default: []},
    activities : {type: [NestedComment], default: []},

    //Date
    created: {type: Date, default:  Date.now()},
    modified: {type: Date, default: Date.now()}
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

//Function remove to test
AssemblyScheama.pre('remove', function (next) {
    if (!this.path)
        next(new Error("The Part contains no path for the information"));

    let assemblyPath = path.join(configServer.files3D, this.path);

    NodeSchema.find({content: this._id, type: TypeEnum.part }).forEach(node => { node.remove(); });    
    
    deleteDirPromise(assemblyPath)
    .then(() => next());
});

AssemblyScheama.statics.newDocument = (assemblyInformation) => {
    return new Assembly(assemblyInformation);
};

AssemblyScheama.plugin(uniqueValidator);

let Assembly = mongoose.model("Assembly", AssemblyScheama, "Assemblies");

module.exports = Assembly;

