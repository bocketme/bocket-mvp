let serverConfiguration = require("../config/server");
let mongoose = require("mongoose");

let NestedWorkspace = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let NestedProject = mongoose.Schema({
    _id: {type: mongoose.SchemaTypes.ObjectId, require: true},
    name: {type: String, require: true}
});

let NodeSchema = mongoose.Schema({
    name: {type:String, require:true },
    object: {type:Object, require: true},
    Workspace: NestedWorkspace,
    Project: NestedProject,
})

let Node = mongoose.model("Node", NodeSchema, "Nodes");

module.exports = Node;