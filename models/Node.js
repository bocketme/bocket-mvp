let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");
let NestedNode = require("./nestedSchema/NestedNodeSchema");
let uniqueValidator = require('mongoose-unique-validator');
let createNode = require("./utils/create/createNode");
let NestedUser = require("./nestedSchema/NestedUserSchema");
let NestedComment = require("./nestedSchema/NestedActivitySchema");
let NodeTypeEnum = require("../enum/NodeTypeEnum");
let NestedSpecFiles = require('./nestedSchema/NestedSpecFile');
let TypeEnum = require('../enum/NodeTypeEnum');
let NestedAnnotation = require('./nestedSchema/NestedAnnotation');
let NestedTeam = require('./nestedSchema/NestedTeamSchema');
const THREE = require('three');

let NestedWorkspace = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let NodeSchema = mongoose.Schema({
    name: {type:String, require:true},
    description: String,
    content: {type: mongoose.SchemaTypes.ObjectId, require: false},
    type: { type:String, default: TypeEnum.empty},
    specpath: {type: [String], default: []},
    tags: {type: [String], default: []},
    children: {type: [NestedNode], default: []},
    created: {type: Date, default:  Date.now()},
    modified: {type: Date, default: Date.now()},
    team: {type: NestedTeam, required: true},
    matrix: {type:[] ,default: new THREE.Matrix4()},
    Workspace: [String],
    owners: {type: [NestedUser], default: []},
    maturity: {type: String, default: [NodeTypeEnum.maturity[0]]},
    activities : {type: [NestedComment], default: []}
});

NodeSchema.plugin(uniqueValidator);

NodeSchema.statics.initializeNode = (name, description, workspaces, user, team) => {
    return new Node({
        name: name,
        description: description,
        Workspace: workspaces,
        Users: user,
        type: TypeEnum.assembly,
        team: team
    })
};

NodeSchema.statics.createNode = (name, description, type, specpath) => {
    return new Node({
        name: name,
        description: description,
        type: type,
        specpath: specpath,
    });
};
NodeSchema.statics.createNodeWithContent = (name, description, type, content, specpath, tags) => {
    return new Node({
        name: name,
        description: description,
        type: type,
        specpath: specpath,
        tags: tags,
        content: content,
    });
};

let Node = mongoose.model("Node", NodeSchema, "Nodes");

module.exports = Node;