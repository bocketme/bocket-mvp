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

let NestedPiece = mongoose.Schema({

});

let NestedAssembly = mongoose.Schema({

});

let NodeSchema = mongoose.Schema({
    name: {type:String, require: true, default: 'My Bocket'},
    description: String,
    // piece: NestedPiece,
    // assembly: NestedAssembly,
    type: { type:String, require: true },
    path: { type:String, require: false },
    specpath: {type: [String], require: true, default: []},
    tags: {type: [String], require:true, default:[]},
    Workspace: { type: [NestedWorkspace], require: true},
})

let Node = mongoose.model("Node", NodeSchema, "Nodes");

module.exports = Node;