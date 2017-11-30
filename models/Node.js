let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");
let NestedNode = require("./nestedSchema/NestedNodeSchema");
let uniqueValidator = require('mongoose-unique-validator');
let createNode = require("./utils/create/createNode");

let NestedWorkspace = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let NestedProject = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let NestedPiece = mongoose.Schema({
    // _id:
    name: {type: String, require: true},
    description: {type: String, default: "No description aviable"},
    path: { type:String, require: true },
    specFiles: { type: [String], default: [] }
});

let NestedAssembly = mongoose.Schema({
    // _id:
    name: {type: String, require: true},
    description: {type: String, default: "No description aviable"},
    path: { type:String, require: true },
    specFiles: { type: [String], default: [] }
});

let NodeSchema = mongoose.Schema({
    name: {type:String, require: true, default: 'My Bocket'},
    description: String,
    piece: {type: NestedPiece},
    assembly: {type: NestedAssembly},
    //type: { type:String, require: true },
    //specpath: {type: [String], require: true, default: []},
    //tags: {type: [String], require:true, default:[]},
    children: {type: [NestedNode], default: []}
    // matrice de donnée ???
})

let Node = mongoose.model("Node", NodeSchema, "Nodes");
// Node.bind()

NodeSchema.plugin(uniqueValidator);

Node.prototype.createPart = (node, part) => {

};

Node.prototype.createAssembly = (node, part) => {

};

Node.prototype.create = createNode;

module.exports = Node;