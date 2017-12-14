const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');
const TypeEnum = require('../enum/NodeTypeEnum');
let NestedAnnotation = require('./nestedSchema/NestedAnnotation');

let AssemblyScheama = mongoose.Schema({
    name: {type: String, require: true},
    //owners: {type: [nestedOwners], default: []}
    description: {type: String, default: "No description aviable"},
    path: { type:String, require: true },
    object: {type: Object, default: {}},
    maturity: {type: String, default: TypeEnum.maturity[0]},
    whereUsed: {type: [String], default: []},
    quality: {type: Number, default:0},
    tags: {type: [], default: []},
    annotation: {type: [NestedAnnotation], default: []}
});

AssemblyScheama.plugin(uniqueValidator);

AssemblyScheama.statics.initialize = (name, description, path, specFiles, tags) => {
    return new Assembly({
        name: name,
        description: description,
        path: path,
        specFiles: specFiles,
        tags: tags
    });
};

let Assembly = mongoose.model("Assembly", AssemblyScheama, "Assemblies");

module.exports = Assembly;

