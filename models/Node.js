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
    piece: {type: NestedPiece, require: false},
    assembly: {type: NestedAssembly, require: false},
    type: { type:String, require: true },
    specpath: {type: [String], require: true, default: []},
    tags: {type: [String], require:true, default:[]},
    Workspace: { type: [NestedWorkspace], require: true},
    // matrice de donnée ???
})

let Node = mongoose.model("Node", NodeSchema, "Nodes");
// Node.bind()

Node.prototype.initializeNode = (name, description, Workspace) => {
    return new Promise((resolve, reject) => {
        if (!name || !description || !Workspace)
        reject(new Error("The Node Must have all the parameters"));
        resolve(new Node({
            name : name,
            description : description,
            Workspace: Workspace,
        }));
    });
}

Node.prototype.createPart = (node, part) => {

}

Node.prototype.createAssembly = (node, part) => {

}

module.exports = Node;