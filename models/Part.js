let mongoose = require("mongoose");
let uniqueValidator = require('mongoose-unique-validator');
const TypeEnum = require('../enum/NodeTypeEnum');
let NestedAnnotation = require('./nestedSchema/NestedAnnotation');

let PartSchema = mongoose.Schema({
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

PartSchema.plugin(uniqueValidator);

PartSchema.statics.initialize = (name, description, path, tags) => {
    return new Part({
        name: name,
        description: description,
        path: path,
        tags: tags
    });
};

let Part = mongoose.model("Part", PartSchema, "Parts");

module.exports = Part;
