let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");
let NestedNode = require("./nestedSchema/NestedNodeSchema");
let uniqueValidator = require('mongoose-unique-validator');
let createNode = require("./utils/create/createNode");
let NestedUser = require("./nestedSchema/NestedUserSchema");
let NodeTypeEnum = require("../enum/NodeTypeEnum");

let NestedWorkspace = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let NestedProject = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let NestedPiece = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true},
    description: {type: String, default: "No description aviable"},
    path: { type:String, require: true },
    specFiles: { type: [String], default: [] }
});

let NestedAssembly = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true},
    description: {type: String, default: "No description aviable"},
    path: { type:String, require: true },
    specFiles: { type: [String], default: [] }
});

let NodeSchema = mongoose.Schema({
    name: {type:String, default: 'My Bocket'},
    description: String,
    piece: {type: NestedPiece, default: null},
    assembly: {type: NestedAssembly, default: null},
    type: { type:String, default:'assembly'},
    specpath: {type: [String], default: []},
    tags: {type: [String], default: []},
    children: {type: [NestedNode], default: []},
    created: {type: Date, default:  Date.now()},
    modified: {type: Date, default: Date.now()},
    Users: {type: [NestedUser], default: []},
    Workspace: [String],
    owners: {type: [NestedUser], default: []},
    maturity: {type: String, default: [NodeTypeEnum.maturity[0]]}
    //matrice de donnée ???
});

NodeSchema.plugin(uniqueValidator);

NodeSchema.statics.initializeNode = (name, description, workspaces, user) => {
    return new Node({
        name: name,
        description: description,
        Workspace: workspaces,
        Users: user
    })
};

NodeSchema.statics.createNode = (name, description, type, specpath, tags) => {
    return new Node({
        name: name,
        description: description,
        type: type,
        specpath: specpath,
        tags: tags
    });
};

NodeSchema.methods.createPiece = (node, piece) => {
    node.piece = piece;
    return node;
};

NodeSchema.methods.createAssembly = (node, assembly) => {
    node.assembly = assembly;
    return node;
};
let Node = mongoose.model("Node", NodeSchema, "Nodes");

module.exports = Node;